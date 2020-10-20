import {DB_PATH} from './environment';
import sha256 from 'crypto-js/sha256';
const sqlite3 = window.require('sqlite3');

// 이 클래스로만 db에 접근하도록 하자
export class StrongboxDatabase{
    private static strongboxDatabase: StrongboxDatabase;
    private static db: any;


    public static getInstance() {
        //싱글톤을 사용하자
        if(!StrongboxDatabase.strongboxDatabase){
            StrongboxDatabase.strongboxDatabase = new StrongboxDatabase();
        }
        return StrongboxDatabase.strongboxDatabase;
    }

    private connectDatabase(): boolean{
        //DB연결
        if(!StrongboxDatabase.db){
            StrongboxDatabase.db = new sqlite3.Database(DB_PATH, (err:any) =>{
                if(err){
                    console.log("에러발생: " + err);
                    return false;
                }
            });
        }
        console.log("db연결 성공");
        return true;
    }

    private disconnectDatabase(){
        //DB연결 해제
        if(StrongboxDatabase.db){
            StrongboxDatabase.db.close((err:any) => {
                if (err) {
                    return console.error(err.message);
                }
                console.log('DB연결 종료 성공');
            });
        }
        StrongboxDatabase.db = null;
    }

    private fetchDatabase = (col: string, table: string, where?: string) =>{
        //Promise 이용하여 DB에서 받아와주는 함수
        return new Promise((succ, fail) =>{
            let query = 'SELECT ' + col + ' FROM ' + table;
            if(where){
                query += ' WHERE ' + where;
                console.log(query);
            }
            StrongboxDatabase.db.all(query, [], (err: any, arg: any) =>{
                if (err) {
                    fail(err);
                } else {
                    succ(arg);
                } 
            });
        });
    }

    public async select(col: string, table: string, where?: string){
        // DB에서 SELECT 쿼리 실행하는 함수
        // select할 땐 비동기 문제 땜시 이렇게 해야함

        if(this.connectDatabase()){
            //연결 성공하면
            try {
                let result = await this.fetchDatabase(col,table,where);
                return result;
            } catch (error) {
                throw error;
            }
        }
        this.disconnectDatabase();
    }
    public insert(table: string, col: string, val: string){
        //insert 해주는 함수
        //ex) insert('USER_TB','NAME,PASSWORD,SALT', '홍길동,처음,aa');
        if(this.connectDatabase()){
            const query = 'INSERT INTO ' + table + '(' + col + ') VALUES(' + val + ')'; 
            StrongboxDatabase.db.run(query, (err:any,arg:any)=>{});
            this.disconnectDatabase();
        }
    }
    public async addUser(name: string, password: string){
        // 이름 중복 여부 확인
        // 비밀번호 6글자인지 확인
        // salt 랜덤 생성 // 현재년월일 => sha256
        // 패스워드 암호화 // 패스워드+salt => crypto-js 의 sha256 이용

        const nickname = "'" + name + "'";

        if(this.connectDatabase()){
            let doubleCheck: any = await this.fetchDatabase('NAME','USERS_TB',"NAME = " + nickname); // 이름 겹치는거 꺼내오기
            this.disconnectDatabase();
            if(doubleCheck.length > 0) return false; // 이름이 중복됨
            if(password.length !== 6) return false; // 비번이 6글자가 아님


            const salt = sha256((new Date()).toUTCString()); // salt 생성
            const encrypedPassword = sha256(password + salt); // e(pw+salt) 패스워드+솔트를 다시 sha256으로 암호화
                
            const val = "'" + name + "', '" + encrypedPassword + "', '" + salt + "'";
            this.insert("USERS_TB","NAME,PASSWORD,SALT",val); // 테이블 삽입

            return true;
        }
        return false;
    }
    public async addGroup(userIDX:number, groupName:string){ // 동기식 위해 async 사용
        //매개변수로 유저idx, 그룹이름 받음
        //그룹이름 중복여부 확인필요X
        //owner_idx에 idx 넣고 그룹생성
        if(this.connectDatabase()){
            const val = userIDX + ", '" + groupName + "'";
            this.insert("GROUPS_TB", "OWNER_IDX,GRP_NAME", val);
            this.disconnectDatabase();
            return true;
        }
        return false;
    }
    public async getGroupList(userIDX:number){
        //매개변수로 유저idx
        // 유저idx이용해 그룹 리스트 받아와 json 형태로 리턴
        if(this.connectDatabase()){
            try {
                const promiseList = await this.fetchDatabase("IDX,GRP_NAME","GROUPS_TB","OWNER_IDX = " + userIDX);
                this.disconnectDatabase();
                return promiseList;
            }catch(error){
                return error;
            }
        }

    }
    public async addService(groupIDX:number, serviceName:string){
        //매개변수로 그룹idx, 서비스 이름
        //grp_idx에 그룹idx넣고 서비스 생성
        if(this.connectDatabase()){
            const val = groupIDX + ", '" + serviceName + "'";
            this.insert("SERVICES_TB", "GRP_IDX,SERVICE_NAME", val);
            this.disconnectDatabase();
            return true;
        }
        return false;
    }
    public async getServiceList(groupIDX:number){
        //매개변수로 그룹idx
        // select로 그룹idx이용해 서비스 리스트 받아와 json 형태로 리턴
        if(this.connectDatabase()){
            try {
                const promiseList = await this.fetchDatabase("IDX,SERVICE_NAME","SERVICES_TB","GRP_IDX = " + groupIDX);
                this.disconnectDatabase();
                return promiseList;
            }catch(error){
                return error;
            }
        }
    }
    public addAccountFromSNSLogin(){
        //SNS로그인 연동 시
        //매개변수로 서비스, 계정 이름, SNS로그인 대상 계정이름 을 받음
        //서비스idx를 얻음
        // sns로그인 대상 계정 idx를 얻음
        //service_idx에 서비스idx넣고 sns_login_idx에 계정idx넣고 계정 추가
    }
    public addAccount(){
        //일반 계정 추가 시

        //매개변수로 서비스, 계정 이름, id, password받음
        //서비스idx를 얻음
        //password를 글로벌 변수에 저장해둔 유저의 패스워드+salt를 키로 대칭키 AES 암호화 진행
        //service_idx에 서비스idx넣고 계정 추가

    }
    public getAccountsList(){
        //매개변수로 서비스 받음
        //서비스 idx를 얻음
        //해당 서비스에 해당하는 계정 리스트 출력
    }
}