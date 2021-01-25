import React from 'react';
import styled from 'styled-components';
import Span from '../../components/Span';
import returnImg from '../../images/return.svg';
import { HashRouter, NavLink, Route } from 'react-router-dom';
import SyncResponseMain from './syncContainer/SyncResponseMain';
import SyncConnectSuccess from './syncContainer/SyncConnectSuccess';
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
const SettingSyncResponse = () => {
    return (<TotalWrapper>
        <HeaderWrapper><Span size="2.5rem" fontWeight="700">계정 동기화 응답하기</Span><NavLink to="/Main"><Img src={returnImg} alt="return"/></NavLink></HeaderWrapper>
        <BodyWrapper>
            <HashRouter>
                <Route path="/Setting/syncResponsePage" exact component={SyncResponseMain} />
                <Route path="/Setting/syncResponsePage/connectSuccess" component={SyncConnectSuccess} />
            </HashRouter>
        </BodyWrapper>
    </TotalWrapper>);
}

export default SettingSyncResponse;
