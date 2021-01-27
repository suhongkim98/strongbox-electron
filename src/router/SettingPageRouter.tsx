
import { HashRouter, Route } from 'react-router-dom';
import DeleteUserContainer from './container/DeleteUserContainer';
import SettingSyncRequest from './container/SettingSyncRequest';
import SettingSyncResponse from './container/SettingSyncResponse';
import React from 'react';
import SyncConnectSuccess from './container/syncContainer/SyncConnectSuccess';

const SettingPageRouter = () => {
    return <HashRouter>
    <Route path="/Setting" exact component={SettingSyncRequest} />
    <Route path="/Setting/syncRequestPage" component={SettingSyncRequest} />
    <Route path="/Setting/syncResponsePage" component={SettingSyncResponse} />
    <Route path="/Setting/syncConnectSuccess" component={SyncConnectSuccess} />
    <Route path="/Setting/deleteUserContainer" component={DeleteUserContainer} />
    </HashRouter>;

}

export default SettingPageRouter;
