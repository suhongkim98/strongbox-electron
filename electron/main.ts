import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import {DB_PATH} from '../src/environment';

const sqlite3 = require('sqlite3');
const fs = require('fs');

let win: BrowserWindow | null = null;

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

  // DevTools
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));

  if (isDev) {
    win.webContents.openDevTools();
  }
}
const databaseInit = () =>{
  //db 있는지 검사하고 없으면 inittable 함수호출
  fs.readFile(DB_PATH,(err:any,data:any) => {       //DB경로에 파일이 있는지 검사를 하는데
      if(err){
          if(err.code === 'ENOENT'){          //DB 파일이 없다면
              tableInit(); //테이블 초기화
              return;
          }
          throw err;
      }
      console.log("DB파일이 정상적으로 존재합니다");
  });
}
const tableInit = () => {
  // db 초기 테이블 세팅 함수
      //USERS_TB GROUPS_TB SERVICES_TB ACCOUNTS_TB 생성
      const db = new sqlite3.Database(DB_PATH, (err:any) =>{
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
          '"OWNER_IDX"	INTEGER NOT NULL,' +
          '"GRP_NAME"	TEXT DEFAULT "no-name",' +
          'FOREIGN KEY("OWNER_IDX") REFERENCES "USERS_TB"("IDX") ON UPDATE CASCADE ON DELETE CASCADE' +
      ');';
      db.run(query,[], (arg:any) =>{
          console.log('create init table GROUPS_TB');
      });

      query = 'CREATE TABLE IF NOT EXISTS "SERVICES_TB" (' +
          '"IDX"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
          '"GRP_IDX"	INTEGER NOT NULL,' +
          '"SERVICE_NAME"	TEXT DEFAULT "no name",' +
          'FOREIGN KEY("GRP_IDX") REFERENCES "GROUPS_TB"("IDX") ON UPDATE CASCADE ON DELETE CASCADE' +
      ');';
      db.run(query,[], (arg:any) =>{
          console.log('create init table SERVICES_TB');
      });

      query = 'CREATE TABLE "ACCOUNTS_TB" (' +
          '"IDX"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
          '"SERVICE_IDX"	INTEGER NOT NULL,' +
          '"ACCOUNT_NAME"	TEXT DEFAULT "no name",' +
          '"SNS_LOGIN_IDX"	INTEGER,' +
          '"ID"	TEXT,' +
          '"PASSWORD"	TEXT NOT NULL,' +
          'FOREIGN KEY("SERVICE_IDX") REFERENCES "SERVICES_TB"("IDX") ON UPDATE CASCADE ON DELETE CASCADE,' +
          'FOREIGN KEY("SNS_LOGIN_IDX") REFERENCES "ACCOUNTS_TB"("IDX") ON UPDATE CASCADE ON DELETE CASCADE' +
      ');';
      db.run(query,[], (arg:any) =>{
          console.log('create init table ACCOUNTS_TB');
      });

      db.close((err:any) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('DB연결 종료 성공');
    });  
}
app.on('ready', ()=>{
  createWindow();
  databaseInit(); // app ready시 DB확인
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
