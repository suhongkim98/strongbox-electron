import React from 'react';
import styled from 'styled-components';

const TotalWrapper = styled.div`
width: 100%;
height: 100%;
padding: 25px 60px 0 60px;
`;

const AccountList = styled.div`
width:100%;
height: 100%;

display:grid;
grid-template-columns: repeat(2, 1fr);
grid-auto-rows: 160px;
grid-gap: 10px;

overflow-y:scroll;
::-webkit-scrollbar{
    width:10px;
    display:none;
}
`;
const AccountView = () => {
    return <TotalWrapper><AccountList><Account/><Account/><Account/><Account/><Account/><Account/><Account/><Account/><Account/><Account/><Account/><Account/><Account/><Account/></AccountList></TotalWrapper>
}

export default AccountView;

//////////////
interface AccountProps{
    accountName: string;
    date: string;
    OAuthServiceName?: string;
    accountID: string;
    accountPassword: string;
}
const Wrapper = styled.div`
width:100%;
height:100%;
background-color:white;

border-style:solid;
border-width:1px;
border-color:black;
`;

const Account = () => {
    return <Wrapper></Wrapper>
}