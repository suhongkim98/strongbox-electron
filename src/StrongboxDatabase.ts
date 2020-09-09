const sqlite3 = window.require('sqlite3');

// 이 클래스로만 db에 접근하도록 하자
export class StrongboxDatabase{
    private static strongboxDatabase: StrongboxDatabase;
    private static db: any;
    private static DB_PATH: string = './db/strongbox-database.db';

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
            StrongboxDatabase.db = new sqlite3.Database(StrongboxDatabase.DB_PATH, (err:any) =>{
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
    public tableInit(){
        // db 초기 테이블 세팅 함수
        if(this.connectDatabase()){
            //USERS_TB GROUPS_TB SERVICES_TB ACCOUNTS_TB 생성
            let query = `CREATE TABLE IF NOT EXISTS "USERS_TB" (
                "IDX"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                "NAME"  TEXT NOT NULL DEFAULT 'no name',
                "USE_PIN"    INTEGER NOT NULL DEFAULT 0,
                "PASSWORD"	TEXT NOT NULL,
                "SALT"	TEXT NOT NULL
            );`
            StrongboxDatabase.db.run(query,[], (arg:any) =>{
                console.log('create init table USERS_TB');
            });

            query = `CREATE TABLE IF NOT EXISTS "GROUPS_TB" (
                "IDX"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                "OWNER_IDX"	INTEGER NOT NULL,
                "GRP_NAME"	TEXT DEFAULT 'no-name',
                FOREIGN KEY("OWNER_IDX") REFERENCES "USERS_TB"("IDX") ON UPDATE CASCADE ON DELETE CASCADE
            );`
            StrongboxDatabase.db.run(query,[], (arg:any) =>{
                console.log('create init table GROUPS_TB');
            });

            query = `CREATE TABLE IF NOT EXISTS "SERVICES_TB" (
                "IDX"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                "GRP_IDX"	INTEGER NOT NULL,
                "SERVICE_NAME"	TEXT DEFAULT 'no name',
                FOREIGN KEY("GRP_IDX") REFERENCES "GROUPS_TB"("IDX") ON UPDATE CASCADE ON DELETE CASCADE
            );`
            StrongboxDatabase.db.run(query,[], (arg:any) =>{
                console.log('create init table SERVICES_TB');
            });

            query = `CREATE TABLE "ACCOUNTS_TB" (
                "IDX"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                "SERVICE_IDX"	INTEGER NOT NULL,
                "ACCOUNT_NAME"	TEXT DEFAULT 'no name',
                "SNS_LOGIN_IDX"	INTEGER,
                "ID"	TEXT,
                "PASSWORD"	TEXT NOT NULL,
                FOREIGN KEY("SERVICE_IDX") REFERENCES "SERVICES_TB"("IDX") ON UPDATE CASCADE ON DELETE CASCADE,
                FOREIGN KEY("SNS_LOGIN_IDX") REFERENCES "ACCOUNTS_TB"("IDX") ON UPDATE CASCADE ON DELETE CASCADE
            );`
            StrongboxDatabase.db.run(query,[], (arg:any) =>{
                console.log('create init table ACCOUNTS_TB');
            });
        }
        this.disconnectDatabase();
    }


    // public testCreateTable(): boolean{
    //     if(this.connectDatabase()){
    //         StrongboxDatabase.db.run('CREATE TABLE IF NOT EXISTS testTable ( idx INTEGER PRIMARY KEY, name TEXT)',[], (arg:any) =>{
    //             console.log('create table');
    //         });
    //         this.disconnectDatabase();
    //         return true;
    //     }
    //     return false;
    // }
    // public testInsert(): boolean{
    //     if(this.connectDatabase()){
    //         StrongboxDatabase.db.run('INSERT INTO testTable VALUES(?,?)',[1, '처음'], (err:any,arg:any)=>{});
    //         StrongboxDatabase.db.run('INSERT INTO testTable VALUES(?,?)',[2, 'asdsdsd'], (err:any,arg:any)=>{});
    //         StrongboxDatabase.db.run('INSERT INTO testTable VALUES(?,?)',[3, 'sdasdsdsdsds음'], (err:any,arg:any)=>{});
    //         this.disconnectDatabase();
    //         return true;
    //     }
    //     return false;
    // }
    // public async testSelect(){
    //     // select할 땐 비동기 문제 땜시 이렇게 해야함
    //     function fetch () {
    //         //Promise 이용하여 받아와주는 함수 만들어주고
    //         return new Promise ((succ, fail) => {
    //             StrongboxDatabase.db.all('SELECT * FROM testTable ', [], ( err: any, arg: any ) => {
    //                 if (err) {
    //                     fail(err);
    //                 } else {
    //                     succ(arg);
    //                 }
    //             });
    //         });
    //     }

    //     if(this.connectDatabase()){
    //         //연결 성공하면
    //         try {
    //             const result = await fetch ();
    //             console.log(result);
    //             return result;
    //         } catch (error) {
    //             throw error;
    //         }
    //     }
    //     this.disconnectDatabase();
    // }
}