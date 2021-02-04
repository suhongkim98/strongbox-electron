
//글로벌 변수
declare namespace NodeJS{
    export interface Global {
        idx: number = -1
        key: string = ""
        name: string = ""
        syncInfo: any = {token: "", roomId: ""}
    }
}