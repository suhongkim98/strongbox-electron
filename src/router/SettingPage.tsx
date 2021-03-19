import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import Span from '../components/Span';
import theme from '../styles/theme';
import SettingPageRouter from './SettingPageRouter';

const TotalWrapper = styled.div `
width:100%;
height:100vh;
display: grid;
grid-template-columns: 300px 1fr;
`;
const NavBarWrapper = styled.div`
width:100%;
height:100%;
background-color:${theme.colors.navBackgroundColor};
position:relative;
border-style:solid;
border-width:1px;
border-color:gray;

overflow: hidden;
`;
const NavBarHeader = styled.div`
    height: 50px;
    border-bottom: solid gray 1px;
    padding-left: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
`;
const NavBarBody = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 10px 0 10px;
`;
const NavBarItem = styled.div`
    border-bottom: solid gray 1px;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 50px;
    padding-top: 10px;
`;
const MainWrapper = styled.div`
    position:relative;
    width:100%;
    height:100%;
    background-color:${theme.colors.containerMainColor};
    padding: 30px;
`;
const SettingPage = () => {
    
    return (<TotalWrapper>
    <NavBarWrapper>
        <NavBarHeader>
            <Span fontWeight="700" size="2.5rem" textColor="white">설정</Span>
        </NavBarHeader>
        <NavBarBody>
            <NavLink replace to="/Setting/syncRequestPage"><NavBarItem><Span size="1.6rem" textColor="white">계정 동기화 요청하기</Span></NavBarItem></NavLink>
            <NavLink replace to="/Setting/syncResponsePage"><NavBarItem><Span size="1.6rem" textColor="white">계정 동기화 응답하기</Span></NavBarItem></NavLink>
            <NavLink replace to="/Setting/deleteUserContainer"><NavBarItem><Span size="1.6rem" textColor="darkred">사용자 삭제</Span></NavBarItem></NavLink>
        </NavBarBody>
    </NavBarWrapper>
    <MainWrapper>
        <SettingPageRouter />
    </MainWrapper>
</TotalWrapper>);
}

export default SettingPage;
