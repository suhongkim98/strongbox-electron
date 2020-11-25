import React from 'react';
import styled from 'styled-components';
import PlusSVG from '../images/PlusSVG';

const TotalWrapper = styled.div`
width: 100%;
height: 100%;
padding: 25px 60px 0 60px;
`;


const InnerWrapper = styled.div`
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
const ViewCard = styled.div`
width:100%;
height:100%;
background-color:white;

border-style:solid;
border-width:1px;
border-color:black;
`;
const AddAccountBtn = styled(ViewCard)`
display:flex;
justify-content:center;
align-items:center;
`;
const AccountView = () => {
    return <TotalWrapper><InnerWrapper><Account/><Account/><Account/><Account/><Account/><Account/><Account/><Account/><Account/><Account/><Account/><Account/><Account/><Account/>
    <AddAccountBtn><PlusSVG width="50px" height="50px" color="gray" /></AddAccountBtn></InnerWrapper></TotalWrapper>
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

const Account = () => {
    return <ViewCard></ViewCard>
}