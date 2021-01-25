import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import UserSelectPage from './UserSelectPage';
import PasswordInputPage from './PasswordInputPage';
import UserAddPage from './UserAddPage';
import MainPage from './MainPage';
import SettingPage from './SettingPage';


//일반 react 프로젝트랑은 라우터 사용법이 살 짞 다름
const RootPageRouter:React.FC = () =>{

    return<HashRouter>
      <Route path="/" exact component={UserSelectPage} />
      <Route path="/PasswordInputPage" component={PasswordInputPage} />
      <Route path="/UserAdd" component={UserAddPage}/>
      <Route path="/Main" component={MainPage}/>
      <Route path="/Setting" component={SettingPage}/>
    </HashRouter>;
}

export default RootPageRouter;