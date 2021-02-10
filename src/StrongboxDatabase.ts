import {DB_PATH} from './environment';
import sha256 from 'crypto-js/sha256';
import { AES } from 'crypto-js';
const sqlite3 = window.require('sqlite3');

// 이 클래스로만 db에 접근하도록 하자
export class StrongboxDatabase{
    private static strongboxDatabase: StrongboxDatabase;


    public static getInstance() {
        //싱글톤을 사용하자
        if(!StrongboxDatabase.strongboxDatabase){
            StrongboxDatabase.strongboxDatabase = new StrongboxDatabase();
        }
        return StrongboxDatabase.strongboxDatabase;
    }

    private connectDatabase = () =>{
        const database = new sqlite3.Database(DB_PATH, (err:any) =>{
            if(err){
                console.error(err.message);
            }
        });
        database.run('PRAGMA foreign_keys = ON;'); //외래키 사용
        return database;
    }
    private disconnectDatabase = (db:any) =>{
        db.close((err:any) => {
            if (err) {
                console.error(err.message);
            }
        });
    }
    private getColumnMaxValue = (column: string, table: string) => {
        return new Promise((succ, fail) =>{
            let query = 'SELECT MAX(' + column +') AS COUNT FROM ' + table;
            const db = this.connectDatabase();
            db.all(query, [], (err: any, arg: any) =>{
                if (err) {
                    fail(err);
                } else {
                    succ(arg);
                } 
            });
            this.disconnectDatabase(db);
        });
    }

    private fetchDatabase = (col: string, table: string, where?: string, orderBy?: string, orderType?: string) =>{
        //Promise 이용하여 DB에서 받아와주는 함수
        return new Promise((succ, fail) =>{
            let query = 'SELECT ' + col + ' FROM ' + table;
            if(where){
                query += ' WHERE ' + where;
            }
            if(orderBy) {
                query += ' ORDER BY ' + orderBy;
            }
            if(orderType) {
                query += ' ' + orderType;
            }
            const db = this.connectDatabase();
            db.all(query, [], (err: any, arg: any) =>{
                if (err) {
                    fail(err);
                } else {
                    succ(arg);
                } 
            });
            this.disconnectDatabase(db);
        });
    }

    public async select(col: string, table: string, where?: string){
        // DB에서 SELECT 쿼리 실행하는 함수
        // select할 땐 비동기 문제 땜시 이렇게 해야함

        try {
            let result = await this.fetchDatabase(col,table,where);
            return result;
        } catch (error) {
            throw error;
        }
    }
    public insert(table: string, col: string, val: string){
        //insert 해주는 함수
        //ex) insert('USER_TB','NAME,PASSWORD,SALT', '홍길동,처음,aa');
        const db = this.connectDatabase();
        const query = 'INSERT INTO ' + table + '(' + col + ') VALUES(' + val + ')'; 
        db.run(query, (err:any,arg:any)=>{});
        this.disconnectDatabase(db);
    }
    private deleteRow(table:string, idx: number) {
        return new Promise((succ, fail) =>{
            let query = 'DELETE FROM ' + table + ' WHERE IDX = ' + idx;
            const db = this.connectDatabase();
            db.run(query, function(this:typeof sqlite3, err:any,arg:any){ 
                if(err){
                    fail(err);
                }else{
                    succ(true);
                }
            });
            this.disconnectDatabase(db);
        });
    }
    public async addUser(name: string, password: string){
        // 이름 중복 여부 확인
        // 비밀번호 6글자인지 확인
        // salt 랜덤 생성 // 현재년월일 => sha256
        // 패스워드 암호화 // 패스워드+salt => crypto-js 의 sha256 이용

        const nickname = "'" + name + "'";
        try{
            let doubleCheck: any = await this.fetchDatabase('NAME','USERS_TB',"NAME = " + nickname); // 이름 겹치는거 꺼내오기

            if(doubleCheck.length > 0) return false; // 이름이 중복됨
            if(password.length !== 6) return false; // 비번이 6글자가 아님


            const salt = sha256((new Date()).toUTCString()); // salt 생성
            const encrypedPassword = sha256(password + salt); // e(pw+salt) 패스워드+솔트를 다시 sha256으로 암호화
                    
            const val = "'" + name + "', '" + encrypedPassword + "', '" + salt + "'";
            this.insert("USERS_TB","NAME,PASSWORD,SALT",val); // 테이블 삽입

            return true;
        }
        catch(error){
            console.error(error);
            return false;
        }
    }
    public async addGroup(userIDX:number, groupName:string){ // 동기식 위해 async 사용
        //매개변수로 유저idx, 그룹이름 받음
        //그룹이름 중복여부 확인필요X
        //owner_idx에 idx 넣고 그룹생성
        const getRowIDFromInsertGroup = () =>{
            //Promise 이용하여 DB에 그룹 추가하고 rowid 받아오는 함수
            const val = userIDX + ", '" + groupName + "', (SELECT IFNULL(MAX(SORT_ORDER), 0) + 1 FROM GROUPS_TB)";
            const query = 'INSERT INTO GROUPS_TB(OWNER_IDX,GRP_NAME,SORT_ORDER) VALUES(' + val + ')'; 

            return new Promise((succ, fail) =>{
                const db = this.connectDatabase();
                db.run(query, function(this:typeof sqlite3, err:any,arg:any){ // 클래스 안의 함수 안에서 this를 쓰면 생기는 문제 this 정의해서 드디어 해결!!!!!
                    if(err){
                        fail(err);
                    }else{
                        console.log(`A row has been inserted with rowid ${this.lastID}`);//rowid 받아내기
                        succ(this.lastID);
                    }
                });
                this.disconnectDatabase(db);
            });
        }

        const rowid = await getRowIDFromInsertGroup();
        const orderCount: any = await this.getColumnMaxValue("SORT_ORDER","GROUPS_TB");
        const result = {rowid: rowid, ORDER: orderCount[0].COUNT, groupName: groupName};
        return result;
    }
    public async deleteGroup(groupIDX:number){
        await this.deleteRow('GROUPS_TB', groupIDX);
        return true;
    }
    public async getGroupList(userIDX:number){
        //매개변수로 유저idx
        // 유저idx이용해 그룹 리스트 받아와 json 형태로 리턴
        try {
            const promiseList = await this.fetchDatabase("IDX,GRP_NAME,SORT_ORDER","GROUPS_TB","OWNER_IDX = " + userIDX, "SORT_ORDER", "ASC");
            return promiseList;
        }catch(error){
            return error;
        }

    }
    public async addService(groupIDX:number, serviceName:string){
        //매개변수로 그룹idx, 서비스 이름
        //grp_idx에 그룹idx넣고 서비스 생성
        const getRowIDFromInsertService = () =>{
            //Promise 이용하여 DB에 서비스 추가하고 rowid 받아오는 함수
            const val = groupIDX + ", '" + serviceName + "', (SELECT IFNULL(MAX(SORT_ORDER), 0) + 1 FROM SERVICES_TB)";
            const query = 'INSERT INTO SERVICES_TB(GRP_IDX,SERVICE_NAME,SORT_ORDER) VALUES(' + val + ')'; 

            return new Promise((succ, fail) =>{
                const db = this.connectDatabase();
                db.run(query, function(this:typeof sqlite3, err:any,arg:any){ 
                    if(err){
                        fail(err);
                    }else{
                        console.log(`A row has been inserted with rowid ${this.lastID}`);//rowid 받아내기
                        succ(this.lastID);
                    }
                });
                this.disconnectDatabase(db);
            });
        }

        const rowid = await getRowIDFromInsertService();
        const orderCount: any = await this.getColumnMaxValue("SORT_ORDER","SERVICES_TB");
        const result = {rowid: rowid, ORDER: orderCount[0].COUNT, serviceName: serviceName};
        return result;
    }
    public async deleteService(serviceIDX:number){
        await this.deleteRow('SERVICES_TB', serviceIDX);
        return true;
    }
    public async getServiceList(groupIDX:number){
        //매개변수로 그룹idx
        // select로 그룹idx이용해 서비스 리스트 받아와 json 형태로 리턴
        try {
            const promiseList = await this.fetchDatabase("IDX,SERVICE_NAME,SORT_ORDER","SERVICES_TB","GRP_IDX = " + groupIDX, "SORT_ORDER", "ASC");
            return promiseList;
        }catch(error){
            return error;
        }
    }
    public async getServiceListByUserIDX(userIDX:number){
        const fetch = (userIDX:number) =>{
            //Promise 이용하여 DB에서 받아와주는 함수
            return new Promise((succ, fail) =>{
                const db = this.connectDatabase();
                let query = 'SELECT GROUPS_TB.GRP_NAME,SERVICES_TB.GRP_IDX,SERVICES_TB.IDX AS SERVICE_IDX,SERVICES_TB.SORT_ORDER AS SERVICE_ORDER,SERVICES_TB.SERVICE_NAME ' +
                'FROM GROUPS_TB JOIN SERVICES_TB ON GROUPS_TB.IDX = SERVICES_TB.GRP_IDX WHERE OWNER_IDX = ' + userIDX +
                ' ORDER BY SERVICES_TB.SORT_ORDER ASC';
                //그룹IDX, 서비스IDX, 서비스이름
                db.all(query, [], (err: any, arg: any) =>{
                    if (err) {
                        fail(err);
                    } else {
                        succ(arg);
                    } 
                });
                this.disconnectDatabase(db);
            });
        }
        try {
            const promiseList = await fetch(userIDX);
            return promiseList;
        }catch(error){
            return error;
        }    
    }
    public async addAccount(serviceIdx: number, accountName: string, account: {OAuthAccountIDX?:number, id?:string, password?:string}) {
        const insertAccount = (db:any, count: number) => {
            const key = global.key;
            const encrypedPassword = AES.encrypt(account.password as string, key);
            const query =
            'INSERT INTO ACCOUNTS_TB(SERVICE_IDX,ACCOUNT_NAME,ID,PASSWORD, SORT_ORDER, DATE) ' +
            "VALUES(" + serviceIdx + ",'" + accountName + "','" + account.id + "','" + encrypedPassword + "'," + count + ",datetime('now', 'localtime'))";
            return new Promise((succ, fail) => {
                db.run(query, function(this:typeof sqlite3, err:any,arg:any){ 
                    if(err){
                        fail(err);
                    }else{
                        console.log(`A row has been inserted with rowid ${this.lastID}`);//rowid 받아내기
                        succ(this.lastID);
                    }
                });
            });
        }
        const insertOauthAccount = (db:any, count: number) => {
            const query =
            'INSERT INTO OAUTH_ACCOUNTS_TB(ACCOUNT_IDX, ACCOUNT_NAME, SERVICE_IDX, SORT_ORDER, DATE) ' +
            "VALUES(" + account.OAuthAccountIDX + ",'" + accountName + "'," + serviceIdx + "," + count + ",datetime('now', 'localtime'))";
            return new Promise((succ, fail) => {
                db.run(query, function(this:typeof sqlite3, err:any,arg:any){ 
                    if(err){
                        fail(err);
                    }else{
                        console.log(`A row has been inserted with rowid ${this.lastID}`);//rowid 받아내기
                        succ(this.lastID);
                    }
                });
            });
        }
        const db = this.connectDatabase();
        let rowId: any = -1;
        const accountCount: any = await this.getColumnMaxValue('SORT_ORDER', 'ACCOUNTS_TB');
        if(accountCount[0].COUNT == null) {
            accountCount[0].COUNT = 0;
        }
        const oauthAccountCount: any = await this.getColumnMaxValue('SORT_ORDER', 'OAUTH_ACCOUNTS_TB');
        if(oauthAccountCount[0].COUNT == null) {
            oauthAccountCount[0].COUNT = 0;
        }
        let count = //sort order count
          accountCount[0].COUNT >= oauthAccountCount[0].COUNT
            ? accountCount[0].COUNT + 1
            : oauthAccountCount[0].COUNT + 1;
            
        if(account.OAuthAccountIDX) {
            //oauth 계정 추가
            rowId = await insertOauthAccount(db, count);
        } else {
            //일반 계정 추가
            rowId = await insertAccount(db, count);
        }
        this.disconnectDatabase(db);
        return rowId;
    }
    public async getAccount(serviceIdx: number) {
        const getAccountList = (db: any) => {
            let query = 'SELECT * FROM ACCOUNTS_TB WHERE SERVICE_IDX = ' + serviceIdx + ' ORDER BY SORT_ORDER ASC';
            return new Promise((succ, fail) => {
                db.all(query, [], (err: any, arg: any) =>{
                    if(err) {
                        console.log(err);
                        fail(err);
                    } else {
                        succ(arg);
                    }
                });
            });
        }
        const getOauthAccountList = (db: any) => {
            let query = 'SELECT OTB.IDX, OTB.ACCOUNT_NAME, OTB.SORT_ORDER, OTB.DATE, STB.SERVICE_NAME AS OAUTH_SERVICE_NAME, ATB.ID, ATB.PASSWORD ' +
            'FROM OAUTH_ACCOUNTS_TB OTB ' +
            'JOIN ACCOUNTS_TB ATB ON OTB.ACCOUNT_IDX = ATB.IDX ' +
            'JOIN SERVICES_TB STB ON ATB.SERVICE_IDX = STB.IDX ' +
            'WHERE OTB.SERVICE_IDX = ' +
            serviceIdx +
            ' ORDER BY OTB.SORT_ORDER ASC';
            return new Promise((succ, fail) => {
                db.all(query, [], (err: any, arg: any) =>{
                    if(err) {
                        console.log(err);
                        fail(err);
                    } else {
                        succ(arg);
                    }
                });
            });
        }
        const db = this.connectDatabase();
        const accountList:any = await getAccountList(db);
        const oauthAccountList:any = await getOauthAccountList(db);
        //account, oauth 모두 오름차순으로 뽑았기 때문에 번갈아가며 둘을 합쳐 sort하자
        const result = [];
        let [i, j] = [0, 0];
        while (accountList.length > i && oauthAccountList.length > j) {
        const accountElement = accountList[i];
        const oauthAccountElement = oauthAccountList[j];
        if (accountElement.SORT_ORDER > oauthAccountElement.SORT_ORDER) {
            result.push(oauthAccountElement);
            j++;
        } else {
            result.push(accountElement);
            i++;
        }
        }
        while (accountList.length > i) {
        result.push(accountList[i]);
        i++;
        }
        while (oauthAccountList.length > j) {
        result.push(oauthAccountList[j]);
        j++;
        }
        //
        this.disconnectDatabase(db);
        return result;
    }

    public async deleteAccount(oauthServiceName: any, accountIDX:number){
        if(oauthServiceName) {
            await this.deleteRow('OAUTH_ACCOUNTS_TB', accountIDX);
        } else {
            await this.deleteRow('ACCOUNTS_TB', accountIDX);
        }
        return true;
    }

    public async getAllSyncData() {
        //동기화 데이터 내보낼 계정정보 뽑아내기
        const getData = (query: string) => {
            return new Promise((succ, fail) =>{
                const db = this.connectDatabase();
                db.all(query, [], (err: any, arg: any) =>{
                    if (err) {
                        fail(err);
                    } else {
                        succ(arg);
                    } 
                });
                this.disconnectDatabase(db);
            });
        }

        // 그룹리스트 뽑기
        const groupQuery = "SELECT G_TB.IDX, GRP_NAME FROM GROUPS_TB G_TB JOIN USERS_TB U_TB ON G_TB.OWNER_IDX = U_TB.IDX";
        // 서비스 리스트 뽑기
        const serviceQuery = "SELECT S_TB.IDX, GRP_IDX, SERVICE_NAME "
        + "FROM SERVICES_TB S_TB " 
        + "JOIN GROUPS_TB G_TB ON G_TB.IDX = S_TB.GRP_IDX "
        + "JOIN USERS_TB U_TB ON U_TB.IDX = G_TB.OWNER_IDX";
        // 계정리스트 뽑기
        const accountQuery = "SELECT A_TB.IDX, DATE, SERVICE_IDX, ACCOUNT_NAME, A_TB.ID, A_TB.PASSWORD FROM ACCOUNTS_TB A_TB "
        + "JOIN SERVICES_TB S_TB ON S_TB.IDX = A_TB.SERVICE_IDX "
        + "JOIN GROUPS_TB G_TB ON G_TB.IDX = S_TB.GRP_IDX "
        + "JOIN USERS_TB U_TB ON U_TB.IDX = G_TB.OWNER_IDX "
        + "ORDER BY A_TB.DATE ASC";
        // oauth계정 뽑기"
        const oauthAccountQuery = "SELECT O_TB.IDX, ACCOUNT_IDX, ACCOUNT_NAME, SERVICE_IDX, DATE FROM OAUTH_ACCOUNTS_TB O_TB "
        + "JOIN SERVICES_TB S_TB ON S_TB.IDX = O_TB.SERVICE_IDX "
        + "JOIN GROUPS_TB G_TB ON G_TB.IDX = S_TB.GRP_IDX "
        + "JOIN USERS_TB U_TB ON U_TB.IDX = G_TB.OWNER_IDX "
        + "ORDER BY O_TB.DATE ASC";

        const groups = await getData(groupQuery);
        const services = await getData(serviceQuery);
        const accounts = await getData(accountQuery);
        const oauths = await getData(oauthAccountQuery);

        const result = {
            groups: groups,
            services: services,
            accounts: accounts,
            oauthAccounts: oauths,
        };

        return result;
    }
    public async syncData(data: any) {
        /*
        변수: 그룹, 서비스 이름이 같은게 여러개일 때, 계정이 여러 개일 때 --> 단일만 존재하도록 해야겠다
        그룹
            존재하면 해당 그룹 idx을 기준으로 설정하고 밑에 서비스들 검사 // 동기화 데이터 idx는 key로 사용한다
            존재하지 않으면 하위 모두 추가

        서비스
            존재하면 해당 서비스 기준으로 밑에 계정들 검사
            존재하지 않다면 하위 모두 추가

        계정	서비스에서 계정 검사 하기로 한 경우에만
            id겹치는게 있는지 검사
                패스워드 일치하면 date만 최신으로 업데이트
                패스워드 다르면 date 최신인걸로 업데이트
        */
        const groups = data.groups;
        const services = data.services;
        const accounts = data.accounts;
        const oauthAccounts = data.oauthAccounts;

        const addGroupData = (group: any) => {
            //해당 그룹 하위에 있는 모든 데이터 동기화
        }
       for(let i = 0 ; i < groups.length ; i++) {
           const select: any = await this.fetchDatabase("*", "GROUPS_TB", "GRP_NAME = " + groups.GRP_NAME);
           if(select.length > 0) {
               // 그룹이 존재
           } else {
               // 그룹 존재 x
               addGroupData(groups[i]);
           }
       }
    }
}