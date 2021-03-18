import { app, BrowserWindow,ipcMain } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import {DB_NAME, SETTING_NAME} from '../src/environment';

const sqlite3 = require('sqlite3');
const fs = require('fs');

let win: BrowserWindow | null = null;

let dbPath: any, settingPath: any;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  if (isDev) {
    win.loadURL('http://localhost:3000/index.html');
  } else {
    // 'build/index.html'
    win.loadURL(`file://${__dirname}/../index.html`);
  }

  win.on('closed', () => win = null);

  // Hot Reloading
  if (isDev) {
    // 'node_modules/.bin/electronPath'
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
      forceHardReset: true,
      hardResetMethod: 'exit'
    });
  }

  if  (isDev) {
    // db경로 설정 개발자 모드면 ./accong.db 개발자모드가 아니면 appData경로
    dbPath = path.join('.', DB_NAME);
    settingPath = path.join('.', SETTING_NAME);
    console.log(app.getPath('userData'));
  } else {
    dbPath = path.join(app.getPath('userData'), DB_NAME);
    settingPath = path.join(app.getPath('userData'), SETTING_NAME);
  }
  // electron은 main프로세스, renderer 프로세스가 존재하며 ipcMain, ipcRenderer로 서로 통신함
  // ipcMain은 Renderer 프로세스로부터 메시지를 전달 받고, 응답을 보낼 수 있습니다.
  // ipcRenderer은 Main 프로세스로 메시지를 보내고, 응답받을 수 있습니다.

  ipcMain.on('synchronous-message', (event, arg) => { // 동기방식으로 반환
    console.log(arg);
    event.returnValue = dbPath;
  });

  // DevTools
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));

  if (isDev) {
    win.webContents.openDevTools();
  }
}

app.on('ready', ()=>{
  createWindow();
  databaseInit(); // app ready시 DB확인
  environmentSettingInit();
  win?.removeMenu();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
  
const environmentSettingInit = () =>{
  //환경설정 텍스트파일 없으면 파일 생성, 및 초기화
  fs.readFile(settingPath,(err:any,data:any) => {
    if(err){
      if(err.code === 'ENOENT'){
        fs.writeFile(settingPath, "keepLogin=false\nkeepLoginName=", (err:any) => { // 파일 생성하기
          if(err) throw err;
          //파일 생성 성공
        });
        return;
      }
      throw err;
    }
    //파일이 정상적으로 존재
  });
}

const databaseInit = () =>{
  //db 있는지 검사하고 없으면 inittable 함수호출
  fs.readFile(dbPath,(err:any,data:any) => {       //DB경로에 파일이 있는지 검사를 하는데
      if(err){
          if(err.code === 'ENOENT'){          //DB 파일이 없다면
              tableInit(); //테이블 초기화
              return;
          }
          throw err;
      }
      //파일이 정상적으로 존재
  });
}
const tableInit = () => {
  // db 초기 테이블 세팅 함수
      //USERS_TB GROUPS_TB SERVICES_TB ACCOUNTS_TB 생성
      const db = new sqlite3.Database(dbPath, (err:any) =>{
        if(err){
            console.log("에러발생: " + err);
            return false;
        }
    });      
      let query = 'CREATE TABLE IF NOT EXISTS "USERS_TB" (' +
          '"IDX"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
          '"NAME"  TEXT NOT NULL DEFAULT "no name",' +
          '"PASSWORD"	TEXT NOT NULL,' +
          '"SALT"	TEXT NOT NULL' +
      ');';
      db.run(query,[], (arg:any) =>{
          console.log('create init table USERS_TB');
      });

      query = 'CREATE TABLE IF NOT EXISTS "GROUPS_TB" (' +
          '"IDX"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
          '"SORT_ORDER" INTEGER DEFAULT -1,' +
          '"OWNER_IDX"	INTEGER NOT NULL,' +
          '"GRP_NAME"	TEXT DEFAULT "no-name",' +
          'FOREIGN KEY("OWNER_IDX") REFERENCES "USERS_TB"("IDX") ON UPDATE CASCADE ON DELETE CASCADE' +
      ');';
      db.run(query,[], (arg:any) =>{
          if(arg) {
            console.log(arg);
          }
          console.log('create init table GROUPS_TB');
      });

      query = 'CREATE TABLE IF NOT EXISTS "SERVICES_TB" (' +
          '"IDX"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
          '"SORT_ORDER" INTEGER DEFAULT -1,' +
          '"GRP_IDX"	INTEGER NOT NULL,' +
          '"SERVICE_NAME"	TEXT DEFAULT "no name",' +
          'FOREIGN KEY("GRP_IDX") REFERENCES "GROUPS_TB"("IDX") ON UPDATE CASCADE ON DELETE CASCADE' +
      ');';
      db.run(query,[], (arg:any) =>{
        if(arg) {
          console.log(arg);
        }
          console.log('create init table SERVICES_TB');
      });

      query = 'CREATE TABLE "ACCOUNTS_TB" (' +
          '"IDX"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
          '"SORT_ORDER" INTEGER DEFAULT -1,' +
          '"DATE"	TEXT,' +
          '"SERVICE_IDX"	INTEGER NOT NULL,' +
          '"ACCOUNT_NAME"	TEXT DEFAULT "no name",' +
          '"ID"	TEXT,' +
          '"PASSWORD"	TEXT,' +
          'FOREIGN KEY("SERVICE_IDX") REFERENCES "SERVICES_TB"("IDX") ON UPDATE CASCADE ON DELETE CASCADE' +
      ');';
      db.run(query,[], (arg:any) =>{
        if(arg) {
          console.log(arg);
        }
          console.log('create init table ACCOUNTS_TB');
      });

      query = 'CREATE TABLE "OAUTH_ACCOUNTS_TB" (' +
          '"IDX"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
          '"ACCOUNT_IDX"	INTEGER NOT NULL,' +
          '"ACCOUNT_NAME"	TEXT DEFAULT "no-name",' +
          '"SERVICE_IDX"	INTEGER NOT NULL,' +
          '"SORT_ORDER"	INTEGER DEFAULT -1,' +
          '"DATE"	TEXT,' +
          'FOREIGN KEY("ACCOUNT_IDX") REFERENCES "ACCOUNTS_TB"("IDX") ON UPDATE CASCADE ON DELETE CASCADE,' +
          'FOREIGN KEY("SERVICE_IDX") REFERENCES "SERVICES_TB"("IDX") ON UPDATE CASCADE ON DELETE CASCADE' +
      ');';
      db.run(query,[], (arg:any) =>{
        if(arg) {
          console.log(arg);
        }
          console.log('create init table OAUTH_ACCOUNTS_TB');
      });

      db.close((err:any) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('DB연결 종료 성공');
    });  
}
