import {DB_PATH} from './environment';
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
    

    public addUser(name: string, password: string){
        // 이름 중복 여부 확인
        // 비밀번호 6글자인지 확인
        // salt 랜덤 생성 // 현재시간 기준 => sha256
        // 패스워드 암호화 // 패스워드+salt => crypto-js 의 sha256 이용
    }
    public getUsersList(){
        //유저 닉네임 리스트 출력
    }
    public addGroup(){
        //매개변수로 유저, 그룹이름 받음
        //유저 idx를 얻음
        //owner_idx에 idx 넣고 그룹생성

    }
    public getGroupsList(){
        //매개변수로 유저
        // 유저idx를 얻음
        // select로 유저idx이용해 그룹 리스트 받아옴

    }
    public addService(){
        //매개변수로 그룹, 서비스 이름
        //그룹idx를 얻음
        //grp_idx에 그룹idx넣고 서비스 생성

    }
    public getServicesList(){
        //매개변수로 그룹
        // 그룹idx를 얻음
        // select로 그룹idx이용해 서비스 리스트 받아옴

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

    public testInsert(): boolean{
        if(this.connectDatabase()){
            StrongboxDatabase.db.run('INSERT INTO USERS_TB(NAME,PASSWORD,SALT) VALUES(?,?,?)',['홍길동', '처음','aa'], (err:any,arg:any)=>{});
            StrongboxDatabase.db.run('INSERT INTO USERS_TB(NAME,PASSWORD,SALT) VALUES(?,?,?)',['김두식', 'asdsdsd','aa'], (err:any,arg:any)=>{});
            StrongboxDatabase.db.run('INSERT INTO USERS_TB(NAME,PASSWORD,SALT) VALUES(?,?,?)',['두루미', 'sdasdsdsdsds음','aa'], (err:any,arg:any)=>{});
            this.disconnectDatabase();
            return true;
        }
        return false;
    }
    public async testSelect(){
        // select할 땐 비동기 문제 땜시 이렇게 해야함
        function fetch () {
            //Promise 이용하여 받아와주는 함수 만들어주고
            return new Promise ((succ, fail) => {
                StrongboxDatabase.db.all('SELECT * FROM "USERS_TB" ', [], ( err: any, arg: any ) => {
                    if (err) {
                        fail(err);
                    } else {
                        succ(arg);
                    }
                });
            });
        }

        if(this.connectDatabase()){
            //연결 성공하면
            try {
                const result = await fetch ();
                return result;
            } catch (error) {
                throw error;
            }
        }
        this.disconnectDatabase();
    }
}