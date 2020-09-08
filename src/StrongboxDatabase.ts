const sqlite3 = window.require('sqlite3');

// 이 클래스로만 db에 접근하도록 하자
export class StrongboxDatabase{
    private static strongboxDatabase: StrongboxDatabase;
    private static db: any;
    private static DB_PATH: string = './db/test.db';

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
    public testCreateTable(): boolean{
        if(this.connectDatabase()){
            StrongboxDatabase.db.run('CREATE TABLE IF NOT EXISTS testTable ( idx INTEGER PRIMARY KEY, name TEXT)',[], (arg:any) =>{
                console.log('create',arg);
            });
            this.disconnectDatabase();
            return true;
        }
        return false;
    }
    public testInsert(): boolean{
        if(this.connectDatabase()){
            StrongboxDatabase.db.run('INSERT INTO testTable VALUES(?,?)',[1, '처음'], (err:any,arg:any)=>{});
            StrongboxDatabase.db.run('INSERT INTO testTable VALUES(?,?)',[2, 'asdsdsd'], (err:any,arg:any)=>{});
            StrongboxDatabase.db.run('INSERT INTO testTable VALUES(?,?)',[3, 'sdasdsdsdsds음'], (err:any,arg:any)=>{});
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
                StrongboxDatabase.db.all('SELECT * FROM testTable ', [], ( err: any, arg: any ) => {
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
                console.log(result);
                return result;
            } catch (error) {
                throw error;
            }
        }
        this.disconnectDatabase();
    }
}