import React from 'react';
import styled from 'styled-components';
import PlusSVG from '../images/PlusSVG';
import { StrongboxDatabase } from '../StrongboxDatabase';
import Span from './Span';

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
const CardWrapper = styled.div`
width:100%;
height:100%;
background-color:white;

border-style:solid;
border-width:1px;
border-color:black;
`;

const AddAccountBtn = styled(CardWrapper)`
display:flex;
justify-content:center;
align-items:center;
`;

interface AccountProps{
    accountName: string;
    date: string;
    OAuthServiceName?: string;
    accountID: string;
    accountPassword: string;
}
const ViewCard = styled(CardWrapper)`
padding: 10px 20px 0 20px;
`;
const CardHeader = styled.div`
width:100%;
height:40px;
display: flex;
justify-content:space-between;
align-items:center;

border-style: solid;
border-color: gray;
border-bottom-width: 1px;
`;
const CardBody = styled.div`
width:100%;
height:calc(100% - 40px); //헤더높이 빼기
display:flex;
flex-direction:column;
justify-content:space-around;
`;
const CardBodyItem = styled.div`
width:100%;
height:25px;
display:flex;
justify-content:space-between;
align-items:center;
`;

const AccountView = () => {
    

    const onClickAddAccount = () =>{
        //테스트 삽입
        const database = StrongboxDatabase.getInstance();
        database.addAccount(2,"본캐",{id:"qasds",password:"1232312"}); //id pw방식
        database.addAccount(2,"부캐",{OAuthAccountIDX:2}); // oauth방식
        ///////////
    }
    return <TotalWrapper><InnerWrapper>
        <Account accountName="본캐" date="2019-02-12" accountID="qazw12" accountPassword="1234"/>
        <Account accountName="부캐" date="2019-02-12" OAuthServiceName="네이버" accountID="qaㅁㄴㅇ" accountPassword="1234"/>
        <Account accountName="부캐2" date="2019-02-12" accountID="qaㄴ2" accountPassword="124242"/>
        <Account accountName="부캐3" date="2019-02-12" accountID="qasda12" accountPassword="121232312"/>
        <Account accountName="부캐4" date="2019-02-12" accountID="qwew2" accountPassword="123123"/>
        <Account accountName="붘5" date="2019-02-12" accountID="qazasds" accountPassword="12212"/>
        <Account accountName="부캐6" date="2019-02-12" accountID="qaaaa2" accountPassword="1212234"/>
        <AddAccountBtn onClick={onClickAddAccount}><PlusSVG width="50px" height="50px" color="gray" /></AddAccountBtn>
    </InnerWrapper></TotalWrapper>
}

export default AccountView;

//////////////

const Account = ({accountName,date,OAuthServiceName,accountID,accountPassword}:AccountProps) => {
    return <ViewCard>
        <CardHeader><Span fontWeight="700" size="2.5rem" textColor="black">{accountName}</Span><Span fontWeight="500" size="1.5rem" textColor="black">수정일: {date}</Span></CardHeader>
        <CardBody>
            {OAuthServiceName && <CardBodyItem><Span fontWeight="700" size="1.4rem" textColor="darkred">(!) `{OAuthServiceName}`(으)로 소셜 로그인한 계정입니다.</Span></CardBodyItem>}
            <CardBodyItem><Span fontWeight="700" size="2rem" textColor="black">{OAuthServiceName && OAuthServiceName + " "}아이디</Span><Span size="2rem" textColor="black">{accountID}</Span></CardBodyItem>
            <CardBodyItem><Span fontWeight="700" size="2rem" textColor="black">{OAuthServiceName && OAuthServiceName + " "}비밀번호</Span><Span size="2rem" textColor="black">{accountPassword}</Span></CardBodyItem>
        </CardBody>
    </ViewCard>
}