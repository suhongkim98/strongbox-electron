import React from 'react';
import { HashRouter, NavLink, Route } from 'react-router-dom';
import styled from 'styled-components';
import Span from '../../components/Span';
import returnImg from '../../images/return.svg';
import SyncConnectSuccess from './syncContainer/SyncConnectSuccess';
import SyncRequestMain from './syncContainer/SyncRequestMain';
import SyncRequestPin from './syncContainer/SyncRequestPin';

const TotalWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
`;
const HeaderWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    border-bottom: solid gray 1px;
`;
const BodyWrapper = styled.div`
    height: 100%;
`;
const Img = styled.img`
    width: 30px;
    height: 30px;
`;
const SettingSyncRequest = () => {
    return (<TotalWrapper>
        <HeaderWrapper><Span size="2.5rem" fontWeight="700">계정 동기화 요청하기</Span><NavLink replace to="/Main"><Img src={returnImg} alt="return"/></NavLink></HeaderWrapper>
        <BodyWrapper>
            <HashRouter>
                <Route path="/Setting/syncRequestPage" exact component={SyncRequestMain} />
                <Route path="/Setting/syncRequestPage/connectSuccess/:otherPartName/:vertificationCode" component={SyncConnectSuccess} />
                <Route path="/Setting/syncRequestPage/pin/:vertificationCode" component={SyncRequestPin} />
            </HashRouter>
        </BodyWrapper>
    </TotalWrapper>);
}

export default SettingSyncRequest;
