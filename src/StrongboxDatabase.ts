import {DB_PATH} from './environment';
import sha256 from 'crypto-js/sha256';
import { AES, enc } from 'crypto-js';
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
        return new sqlite3.Database(DB_PATH, (err:any) =>{
            if(err){
                console.error(err.message);
            }
        });
    }
    private disconnectDatabase = (db:any) =>{
        db.close((err:any) => {
            if (err) {
                console.error(err.message);
            }
        });
    }
    private getColumnCount = (column: string, table: string) => {
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
        const orderCount: any = await this.getColumnCount("SORT_ORDER","GROUPS_TB");
        const result = {rowid: rowid, ORDER: orderCount[0].COUNT, groupName: groupName};
        return result;
    }
    public deleteGroup(groupIDX:number){
        try{
            const db = this.connectDatabase();
            const query = 'DELETE FROM GROUPS_TB WHERE IDX = ' + groupIDX;
            db.run(query);
            this.disconnectDatabase(db);
            return true;
        }catch(error){
            console.error(error);
            return false;
        }
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
        const orderCount: any = await this.getColumnCount("SORT_ORDER","SERVICES_TB");
        const result = {rowid: rowid, ORDER: orderCount[0].COUNT, serviceName: serviceName};
        return result;
    }
        
    public deleteService(serviceIDX:number){
        try{
            const db = this.connectDatabase();
            const query = 'DELETE FROM SERVICES_TB WHERE IDX = ' + serviceIDX;
            db.run(query);
            this.disconnectDatabase(db);
            return true;
        }catch(error){
            console.error(error);
            return false;
        }
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
    public async addAccount(serviceIDX:number, accountName:string, account: {OAuthAccountIDX?:number, id?:string, password?:string}){

        //매개변수로 서비스, 계정 이름, id, password,OAuthAccountIDX받음
        //OAuthAccountIDX가 매개변수로 들어왔는지 체크 후 OAuthAccountIDX가 존재하다면 accountName,serviceIDX, OAuthAccountIDX를 쿼리에 집어넣음

        //OAuthAccountIDX가 존재하지 않다면
        //password를 글로벌 변수에 저장해둔 유저의 패스워드+salt키로 대칭키 AES 암호화 진행
        //service_idx에 서비스idx넣고 
        //serviceIDX, accountName, id, password 를 쿼리에 집어넣음
        
        let encrypedPassword;
        const getRowIDFromInsertAccount = () =>{
            //Promise 이용하여 DB에 추가하고 rowid 받아오는 함수
            let query:string;
            if(account.OAuthAccountIDX){
                const val = "'"+accountName + "', " + serviceIDX + ", " + account.OAuthAccountIDX + ", (SELECT IFNULL(MAX(SORT_ORDER), 0) + 1 FROM ACCOUNTS_TB)";
                query = 'INSERT INTO ACCOUNTS_TB(ACCOUNT_NAME,SERVICE_IDX,OAUTH_LOGIN_IDX,SORT_ORDER) VALUES(' + val + ')'; 
            }else{
                const key = global.key;
                encrypedPassword = AES.encrypt(account.password as string, key);
                const val = serviceIDX + ", '" + accountName + "', '" + account.id +"', '" + encrypedPassword+"', (SELECT IFNULL(MAX(SORT_ORDER), 0) + 1 FROM ACCOUNTS_TB)";
                query = 'INSERT INTO ACCOUNTS_TB(SERVICE_IDX,ACCOUNT_NAME,ID,PASSWORD,SORT_ORDER) VALUES(' + val + ')'; 
            }
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

        const rowid = await getRowIDFromInsertAccount();
        const orderCount: any = await this.getColumnCount("SORT_ORDER","ACCOUNTS_TB");
        let [id, password] = [account.id, account.password];
        if(account.OAuthAccountIDX) { // oauth계정 추가한거라면 db에서 해당 id, pw를 꺼냄
            const oauthRow: any = await this.fetchDatabase("ID, PASSWORD", "ACCOUNTS_TB", "IDX = " + account.OAuthAccountIDX);
            const decryped = (AES.decrypt(oauthRow[0].PASSWORD, global.key)).toString(enc.Utf8);
            [id, password] = [oauthRow[0].ID, decryped];
        }
        const date = new Date();
        const now = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        const result = {
            ROWID: rowid,
            ORDER: orderCount[0].COUNT,
            DATE:now, 
            NAME:accountName,
            SERVICE_IDX:serviceIDX,
            OAuthIDX:account.OAuthAccountIDX,
            ID:id,
            PASSWORD:password};
        return result;
    }

    public async getAccountList(userIDX:number){
        const fetchAllAccount = (userIDX:number) =>{
            //Promise 이용하여 DB에서 받아와주는 함수
            return new Promise((succ, fail) =>{
                let query = 'SELECT ACCOUNTS_TB.IDX,SERVICE_IDX,ACCOUNTS_TB.SORT_ORDER AS ACCOUNT_ORDER,ACCOUNT_NAME,DATE,OAUTH_LOGIN_IDX,ID,PASSWORD FROM ACCOUNTS_TB '
                + 'JOIN SERVICES_TB ON ACCOUNTS_TB.SERVICE_IDX = SERVICES_TB.IDX '
                + 'JOIN GROUPS_TB ON SERVICES_TB.GRP_IDX = GROUPS_TB.IDX '
                + 'WHERE GROUPS_TB.OWNER_IDX = ' + userIDX
                + ' ORDER BY ACCOUNTS_TB.SORT_ORDER ASC';

                const db = this.connectDatabase();
                db.all(query, [], (err: any, arg: any) =>{
                    if (err) {
                        console.log(err);
                        fail(err);
                    } else {
                        succ(arg);
                    } 
                });
                this.disconnectDatabase(db);
            });
        }
        const fetchOAuthAccount = (oauthIDXArr:any) =>{
            //oauthIDX를 넣으면 해당 idx의 계정이름, id, pw를 가져와서 json 업데이트를 하자
            return new Promise((succ, fail) =>{
                let idx = '(';
                for(let i = 0; i < oauthIDXArr.length ; i++){
                    idx += oauthIDXArr[i];
                    if(i !== oauthIDXArr.length - 1) idx += ',';
                    else idx += ')';
                }
                let query = 'SELECT ATB.IDX,STB.SERVICE_NAME,ATB.ACCOUNT_NAME,ATB.ID,ATB.PASSWORD FROM ACCOUNTS_TB ATB,SERVICES_TB STB '+
                'WHERE ATB.IDX IN ' + idx + ' AND ATB.SERVICE_IDX = STB.IDX';
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
        try {
            const allAccountList:any = await fetchAllAccount(userIDX);
            
            const list = [];
            for(let i = 0 ; i < allAccountList.length ; i++){
                if(allAccountList[i].OAUTH_LOGIN_IDX) list.push(allAccountList[i].OAUTH_LOGIN_IDX);
            }
            if(list.length > 0){
                const oauthAccountList:any = await fetchOAuthAccount(list);

                for(let i = 0 ; i < allAccountList.length ; i++){
                    for(let j = 0 ; j < oauthAccountList.length ; j++){ // 나중에 SQL문으로 한번에 뽑아보자
                        if(allAccountList[i].OAUTH_LOGIN_IDX === oauthAccountList[j].IDX){
                            allAccountList[i].OAUTH_SERVICE_NAME = oauthAccountList[j].SERVICE_NAME;
                            allAccountList[i].ID = oauthAccountList[j].ID;
                            allAccountList[i].PASSWORD = oauthAccountList[j].PASSWORD;
                        }
                    }
                }
            }
            return allAccountList;
        }catch(error){
            return error;
        }  
    }    
    public deleteAccount(accountIDX:number){
        try{
            const db = this.connectDatabase();
            const query = 'DELETE FROM ACCOUNTS_TB WHERE IDX = ' + accountIDX;
            db.run(query);
            this.disconnectDatabase(db);
            return true;
        }catch(error){
            console.error(error);
            return false;
        }
    }
}