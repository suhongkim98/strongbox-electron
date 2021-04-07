import sha256 from 'crypto-js/sha256';
import { AES, enc } from 'crypto-js';
import { result } from 'lodash';
const sqlite3 = window.require('sqlite3');
const { ipcRenderer } = window.require('electron'); // window.require로 가져와야 하더라,, sqlite처럼

// 이 클래스로만 db에 접근하도록 하자
export class StrongboxDatabase{
    private static strongboxDatabase: StrongboxDatabase;
    private dbPath: any;

    public static getInstance() {
        //싱글톤을 사용하자
        if(!StrongboxDatabase.strongboxDatabase){
            StrongboxDatabase.strongboxDatabase = new StrongboxDatabase();
            StrongboxDatabase.strongboxDatabase.dbPath = ipcRenderer.sendSync('synchronous-message', 'plz show me the db path'); // 동기 방식으로 icpMain에게 경로요청 후 매핑
            console.log('current path is ' + StrongboxDatabase.strongboxDatabase.dbPath);
        }
        return StrongboxDatabase.strongboxDatabase;
    }

    private connectDatabase = () =>{
        const database = new sqlite3.Database(this.dbPath, (err:any) =>{
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

    private getQuery(query: string, params?: any[]){
        return new Promise((succ, fail) =>{
            const db = this.connectDatabase();
            db.all(query, params, (err: any, arg: any) =>{
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
    public async deleteUser(userIDX: number) {
        const query = 'DELETE FROM USERS_TB WHERE IDX = ' + userIDX;
        const result = await this.getQuery(query);
        return result;
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
            let encrypedPassword = AES.encrypt(account.password as string, key).toString();
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
        

        // 그룹리스트 뽑기
        const groupQuery = "SELECT IDX, GRP_NAME FROM GROUPS_TB WHERE OWNER_IDX = " + global.idx;
        // 서비스 리스트 뽑기
        const serviceQuery = "SELECT S_TB.IDX, GRP_IDX, SERVICE_NAME "
        + "FROM SERVICES_TB S_TB " 
        + "JOIN GROUPS_TB G_TB ON G_TB.IDX = S_TB.GRP_IDX "
        + "JOIN USERS_TB U_TB ON U_TB.IDX = G_TB.OWNER_IDX "
        + "WHERE U_TB.IDX = " + global.idx;
        // 계정리스트 뽑기
        const accountQuery = "SELECT A_TB.IDX, DATE, SERVICE_IDX, ACCOUNT_NAME, A_TB.ID, A_TB.PASSWORD FROM ACCOUNTS_TB A_TB "
        + "JOIN SERVICES_TB S_TB ON S_TB.IDX = A_TB.SERVICE_IDX "
        + "JOIN GROUPS_TB G_TB ON G_TB.IDX = S_TB.GRP_IDX "
        + "JOIN USERS_TB U_TB ON U_TB.IDX = G_TB.OWNER_IDX "
        + "WHERE U_TB.IDX = " + global.idx + " "
        + "ORDER BY A_TB.DATE ASC "
        // oauth계정 뽑기"
        const oauthAccountQuery = "SELECT O_TB.IDX, ACCOUNT_IDX, ACCOUNT_NAME, SERVICE_IDX, DATE FROM OAUTH_ACCOUNTS_TB O_TB "
        + "JOIN SERVICES_TB S_TB ON S_TB.IDX = O_TB.SERVICE_IDX "
        + "JOIN GROUPS_TB G_TB ON G_TB.IDX = S_TB.GRP_IDX "
        + "JOIN USERS_TB U_TB ON U_TB.IDX = G_TB.OWNER_IDX "
        + "WHERE U_TB.IDX = " + global.idx + " "
        + "ORDER BY O_TB.DATE ASC ";

        const groups = await this.getQuery(groupQuery);
        const services = await this.getQuery(serviceQuery);
        const accounts = await this.getQuery(accountQuery);
        const oauths = await this.getQuery(oauthAccountQuery);

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
        변수: 그룹, 서비스, 계정 이름이 같은게 여러개일 때, 계정이 여러 개일 때 --> 이름 기준으로 상위 기준 단일만 존재하도록
        hashmap에 키로 동기화할 상대방 데이터의 index를 key로, value는 현재 디바이스에 해당하는 기존에 존재하는 데이터나 새로 생성한 데이터의 index로
        */
        const groups = data.groups;
        const services = data.services;
        const accounts = data.accounts;
        const oauthAccounts = data.oauthAccounts;

        const addGroupData = (group: any) => {
            //해당 그룹 추가
            //idx반환
            const userIdx = global.idx;
            return new Promise((succ, fail) => {
                this.addGroup(userIdx, group.GRP_NAME).then((result) => {
                    succ(result.rowid);
                }).catch((error) => {
                    fail(error);
                });
            });
        }
        const addServiceData = (service: any, targetGroupIdx: number) => {
            //target그룹idx로 해당 서비스 추가
            //idx반환
            return new Promise((succ, fail) => {
                this.addService(targetGroupIdx, service.SERVICE_NAME).then((result) => {
                    succ(result.rowid);
                }).catch((error) => {
                    fail(error);
                });
            });
        }
        const addAccountData = (account: any, targetServiceIdx: number) => {
            //target서비스idx로 해당 계정 추가
            //idx반환
            return new Promise((succ, fail) => {
                this.addAccount(targetServiceIdx, account.ACCOUNT_NAME, {id: account.ID, password: account.PASSWORD}).then((result) => {
                    succ(result);
                }).catch((error) => {
                    fail(error);
                });
            });
        }
        const addOauthAccountData = (oauthAccount: any, targetServiceIdx: number, targetAccountIdx: number) => {
            //target서비스idx, target계정idx로 해당 oauth계정 추가
            //idx반환
            return new Promise((succ, fail) => {
                this.addAccount(targetServiceIdx, oauthAccount.ACCOUNT_NAME, {OAuthAccountIDX: targetAccountIdx}).then((result) => {
                    succ(result);
                }).catch((error) => {
                    fail(error);
                });
            });
        }
        const updateAccountData = (account: any, targetAccountIdx: number) => {
            // target서비스idx, target계정idx로 계정 업데이트
            //비밀번호 암호화해서 저장
            const id = account.ID;
            const encrypedPassword = AES.encrypt(account.PASSWORD as string, global.key);

            const query = "UPDATE ACCOUNTS_TB SET (ID, PASSWORD, DATE) = ('" + id + "', '" + encrypedPassword + "', datetime('now', 'localtime')) "
            + "WHERE IDX = " + targetAccountIdx;
            return this.getQuery(query);
        }
        const updateOauthAccountData = (oauthAccount: any, targetServiceIdx: number, targetAccountIdx: number) => {
            //target서비스idx, target계정idx로 oauth 계정 업데이트
            const query = "UPDATE OAUTH_ACCOUNTS_TB SET (ACCOUNT_NAME, DATE) = ('" + oauthAccount.ACCOUNT_NAME + "', datetime('now', 'localtime')) "
            + "WHERE ACCOUNT_IDX = " + targetAccountIdx + " AND SERVICE_IDX = " + targetServiceIdx;
            return this.getQuery(query);
        }
        const getAccountDateQuery = (accountIdx: any) => {
            const query = 'SELECT DATE FROM ACCOUNTS_TB WHERE IDX = ' + accountIdx;
            return this.getQuery(query);
        }

        const groupKeyMap: any = {}; // 동기화하고자 하는 데이터 idx를 key로, value는 새로 생성하거나 기존에 존재한 그룹idx로
        const serviceKeyMap: any ={};
        const accountKeyMap: any = {};
        const oauthAccountKeyMap: any = {};
        if(groups != null) {
            /* 그룹 동기화 */
            for(let i = 0 ; i < groups.length ; i++){
                const group = groups[i];
                const groupIdx = await this.isExistGroupName(group.GRP_NAME);
                if(groupIdx > 0) {
                    // 그룹이 존재하다면
                    groupKeyMap['key' + group.IDX] = groupIdx;
                } else {
                    // 그룹이 존재하지 않다면 새로 생성하고 키 지정
                    const newGroupIdx = await addGroupData(group);
                    groupKeyMap['key' + group.IDX] = newGroupIdx;
                }
            }
        }
        if(services != null) {
            /* 서비스 동기화 */
            for(let i = 0 ; i < services.length ; i++) {
                const service = services[i];
                const serviceIdx = await this.isExistServiceName(service.SERVICE_NAME, groupKeyMap['key' + service.GRP_IDX]);
                if(serviceIdx > 0) {
                    // 해당 key에 동기화 하고자 하는 서비스가 존재하는 경우
                    serviceKeyMap['key' + service.IDX] = serviceIdx;
                } else {
                    const newServiceIdx = await addServiceData(service, groupKeyMap['key' + service.GRP_IDX]);
                    serviceKeyMap['key' + service.IDX] = newServiceIdx;
                }
            }
        }
        if(accounts != null) {
            /* 계정 동기화 */
            for(let i = 0 ; i < accounts.length ; i++) {
                const account = accounts[i];
                const accountIdx = await this.isExistAccountName(account.ACCOUNT_NAME, serviceKeyMap['key' + account.SERVICE_IDX]);
                if(accountIdx > 0) {
                    // 해당 서비스에 계정이 이미 존재하는 경우
                    // date 비교 후 동기화 하고자 하는 계정이 최신인 경우 교체 아니면 냅두기
                    const select: any = await getAccountDateQuery(accountIdx);
                    const previousDataDate = new Date(select[0].DATE);
                    const newDataDate = new Date(account.DATE);
                                
                    if(previousDataDate.getTime() < newDataDate.getTime()) {
                        //새로운 데이터가 더 최신인 경우
                        await updateAccountData(account, accountIdx); 
                    }
                    accountKeyMap['key' + account.IDX] = accountIdx;
                } else {
                    const newAccountIdx = await addAccountData(account, serviceKeyMap['key' + account.SERVICE_IDX]);
                    accountKeyMap['key' + account.IDX] = newAccountIdx;
                }
            }
        }
        if(oauthAccounts != null) {
            /* oauth계정 동기화 */
            for(let i = 0 ; i < oauthAccounts.length ; i++) {
                const oauthAccount = oauthAccounts[i];
                const oauthAccountIdx = await this.isExistOauthAccountName(oauthAccount.ACCOUNT_NAME, serviceKeyMap['key' + oauthAccount.SERVICE_IDX], accountKeyMap['key' + oauthAccount.ACCOUNT_IDX]);
                if(oauthAccountIdx > 0) {
                    // 이미 존재하면 date를 오늘 날짜로 변경
                    await updateOauthAccountData(oauthAccount, serviceKeyMap['key' + oauthAccount.SERVICE_IDX], accountKeyMap['key' + oauthAccount.ACCOUNT_IDX]); //date만 최신으로 업데이트
                    oauthAccountKeyMap['key' + oauthAccount.IDX] = oauthAccountIdx;
                } else {
                    const newOauthAccountIdx = await addOauthAccountData(oauthAccount, serviceKeyMap['key' + oauthAccount.SERVICE_IDX], accountKeyMap['key' + oauthAccount.ACCOUNT_IDX]);
                    oauthAccountKeyMap['key' + oauthAccount.IDX] = newOauthAccountIdx;
                }
            }
        }
    }
    public async isExistGroupName(grpName: string) {
        const query = "SELECT * FROM GROUPS_TB "
        + "WHERE OWNER_IDX = " + global.idx + " AND GRP_NAME = '" + grpName + "'";
        const select: any = await this.getQuery(query);
        if(select.length > 0) {
            return select[0].IDX;
        }
        return -1;
    }
    public async isExistServiceName(serviceName: string, groupIndex: number) {
        const query = "SELECT * FROM SERVICES_TB "
        + "WHERE GRP_IDX = " + groupIndex + " AND SERVICE_NAME = '" + serviceName + "'";
        const select: any = await this.getQuery(query);
        if(select.length > 0) {
            return select[0].IDX;
        }
        return -1;
    }
    public async isExistAccountName(accountName: string, serviceIndex: number) {
        const query = "SELECT * FROM ACCOUNTS_TB "
        + "WHERE SERVICE_IDX = " + serviceIndex + " AND ACCOUNT_NAME = '" + accountName + "'";
        const select: any = await this.getQuery(query);
        if(select.length > 0) {
            return select[0].IDX;
        }
        return -1;
    }
    public async isExistOauthAccountName(oauthAccountName: string, serviceIndex: number, accountIndex: number) {
        //해당 서비스에 특정 계정idx를 참조하는 중복된 이름이 있는지 검사
        const query = "SELECT * FROM OAUTH_ACCOUNTS_TB "
        + "WHERE SERVICE_IDX = " + serviceIndex + " AND ACCOUNT_NAME = '" + oauthAccountName + "' AND ACCOUNT_IDX = " + accountIndex;
        const select: any = await this.getQuery(query);
        if(select.length > 0) {
            return select[0].IDX;
        }
        return -1;
    }
    public async resetCount(userIdx: number) {
        const query = 'UPDATE USERS_TB SET COUNT = 0 WHERE IDX = ' + userIdx;
        const result = await this.getQuery(query);
        return result;
    }
    public async countUp(userIdx: number) {
        const countQuery: any = await this.getQuery('SELECT COUNT FROM USERS_TB WHERE IDX = ' + userIdx);
        const count = countQuery[0].COUNT + 1;
        const query = 'UPDATE USERS_TB SET COUNT = ' + count + ' WHERE IDX = ' + userIdx;
        const result = await this.getQuery(query);
        return result;
    }
    public async banUser(userIdx: number) {
        await this.resetCount(userIdx);
        const banDate = new Date();
        banDate.setMinutes(banDate.getMinutes() + 5); // 5분 밴
        const toStringDate = banDate.getFullYear() + '-' + (banDate.getMonth() + 1) + '-' + banDate.getDate() + ' ' + banDate.getHours() + ':' + banDate.getMinutes() + ':' + banDate.getSeconds();
        const query = "UPDATE USERS_TB SET BAN = '" + toStringDate + "' WHERE IDX = " + userIdx;
        const result = await this.getQuery(query);
        return result;
    }
    public async changeGroupName(groupIdx:number, text:string) {
        const isExist = await this.isExistGroupName(text);
        if(isExist > 0) {
            return false;
        }
        const query = "UPDATE GROUPS_TB SET(GRP_NAME) = ('" + text + "') WHERE IDX = " + groupIdx;
        await this.getQuery(query);
        return result;
    }
    public async changeServiceName(serviceIdx:number, text?:string, groupIdx?: number) {
        const service: any = await this.getQuery("SELECT GRP_IDX, SERVICE_NAME FROM SERVICES_TB WHERE IDX = " + serviceIdx);
        if(groupIdx == null) {
            groupIdx = service[0].GRP_IDX as number;
        }
        if(text == null) {
            text = service[0].SERVICE_NAME as string;
        }
        const isExist = await this.isExistServiceName(text, groupIdx);
        if(isExist > 0) {
            return false;
        }
        const query = "UPDATE SERVICES_TB SET(SERVICE_NAME, GRP_IDX) = ('" + text + "', " + groupIdx + ") WHERE IDX = " + serviceIdx;
        await this.getQuery(query);
        return result;
    }
    public async getAccountInfo(accountIdx: number, isOauth: boolean) {
        // 그룹idx, 서비스 idx, 별명, 아이디, 비번
        let query = null;
        let result = null;
        if(isOauth) {
            query = 
            "SELECT OTB.ACCOUNT_NAME, OTB.SERVICE_IDX AS SERVICE_IDX, STB.GRP_IDX AS GRP_IDX  FROM OAUTH_ACCOUNTS_TB AS OTB "
            + "JOIN SERVICES_TB AS STB ON STB.IDX = OTB.SERVICE_IDX "
            + "WHERE  OTB.IDX = " + accountIdx;
            const execute: any = await this.getQuery(query);
            result = {
                ACCOUNT_NAME: execute[0].ACCOUNT_NAME,
                SERVICE_IDX: execute[0].SERVICE_IDX,
                GRP_IDX: execute[0].GRP_IDX,
            };
            
        } else {
            query = "SELECT ATB.ACCOUNT_NAME, ATB.ID, ATB.PASSWORD, ATB.SERVICE_IDX AS SERVICE_IDX, STB.GRP_IDX AS GRP_IDX FROM ACCOUNTS_TB AS ATB "
            + "JOIN SERVICES_TB AS STB ON STB.IDX = ATB.SERVICE_IDX "
            + "WHERE ATB.IDX = " + accountIdx;
            const execute: any = await this.getQuery(query);

            const decrypted = (AES.decrypt(execute[0].PASSWORD, global.key)).toString(enc.Utf8);

            result = {
                ACCOUNT_NAME: execute[0].ACCOUNT_NAME,
                ID: execute[0].ID,
                PASSWORD: decrypted,
                SERVICE_IDX: execute[0].SERVICE_IDX,
                GRP_IDX: execute[0].GRP_IDX,
            };
        }
        return result;
    }
    public async changeAccountInfo(accountIdx: number, isOauth: boolean, serviceIdx:number, accountName?: string, id?:string, password?:string) {
        if(isOauth) {
            if(accountName != null) {
                const select: any = await this.getQuery("SELECT ACCOUNT_IDX FROM OAUTH_ACCOUNTS_TB WHERE IDX = " + accountIdx);
                const idx = select[0].ACCOUNT_IDX;
                const isExist = await this.isExistOauthAccountName(accountName, serviceIdx, idx);
                if(isExist > 0) {
                    return false;
                }

                const query = 
                "UPDATE OAUTH_ACCOUNTS_TB SET(ACCOUNT_NAME, SERVICE_IDX, DATE) = (?,?,datetime('now', 'localtime')) WHERE IDX = " + accountIdx;
                await this.getQuery(query, [accountName, serviceIdx]);
            } else {
                const query =
                "UPDATE OAUTH_ACCOUNTS_TB SET(SERVICE_IDX, DATE) = (?,datetime('now', 'localtime')) WHERE IDX = " + accountIdx;
                await this.getQuery(query, [serviceIdx]);
            }
        } else {
            const key = global.key;
            let encrypedPassword = AES.encrypt(password as string, key).toString();

            if(accountName != null) {
                const isExist = await this.isExistAccountName(accountName, serviceIdx);
                if(isExist > 0) {
                    return false;
                }
                const query =
                "UPDATE ACCOUNTS_TB SET(ACCOUNT_NAME,SERVICE_IDX,ID,PASSWORD,DATE) = (?,?,?,?,datetime('now', 'localtime')) WHERE IDX = " + accountIdx;
                await this.getQuery(query,[accountName,serviceIdx,id,encrypedPassword]);
            } else {
                const query = 
                "UPDATE ACCOUNTS_TB SET(SERVICE_IDX,ID,PASSWORD,DATE) = (?,?,?,datetime('now', 'localtime')) WHERE IDX = " + accountIdx;
                await this.getQuery(query,[serviceIdx,id,encrypedPassword]);
            }
        }
        return true;
    }
}