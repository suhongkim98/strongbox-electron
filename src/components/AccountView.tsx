import React, { useState } from 'react';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import PlusSVG from '../images/PlusSVG';
import { RootState } from '../modules';
import { updateAccountAsync } from '../modules/accountList';
import { StrongboxDatabase } from '../StrongboxDatabase';
import AddAccountPopup from './AddAccountPopup';
import PopupWarning from './PopupWarning';
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
min-width: 400px;
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
    idx: number;
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
    const [addAccountPopup,setAddAccountPopup] = useState(false);
    const accountList = useSelector((state: RootState) => state.accountList.list);

    const onAddAccountClicked = () =>{
        setAddAccountPopup(true);
    }
    return <TotalWrapper>
        {addAccountPopup && <AddAccountPopup onBackgroundClicked={()=>{setAddAccountPopup(false)}} />}
        <InnerWrapper>
        {accountList.map((data:any)=>{
            if(data.OAUTH_SERVICE_NAME){
                //OAUTH 로그인인 경우
                return <Account key={data.SORT_ORDER} idx={data.IDX} accountName={data.ACCOUNT_NAME} date={data.DATE} OAuthServiceName={data.OAUTH_SERVICE_NAME} accountID={data.ID} accountPassword={data.PASSWORD}/>
            }
            return <Account key={data.SORT_ORDER} idx={data.IDX} accountName={data.ACCOUNT_NAME} date={data.DATE} accountID={data.ID} accountPassword={data.PASSWORD} />
            })}
        <AddAccountBtn onClick={(onAddAccountClicked)}><PlusSVG width="50px" height="50px" color="gray" /></AddAccountBtn>
    </InnerWrapper></TotalWrapper>
}

export default AccountView;

//////////////

const Account = ({idx,accountName,date,OAuthServiceName,accountID,accountPassword}:AccountProps) => {
    const [deleteAccountPopup,setDeleteAccountPopup] = useState(false);
    const dispatch = useDispatch();
    const CONTEXT_ID = "contextAccount" + idx;
    const selectedService = useSelector((state: RootState) => state.selectedService.itemIndex);

    const deleteAccountByIDX = () =>{
        const database = StrongboxDatabase.getInstance();
        database.deleteAccount(OAuthServiceName, idx)
        .then(()=>{dispatch(updateAccountAsync(selectedService.idx));})
        .catch((error)=>console.log(error));
    }
    const onClickMenu = (e:any, data:any) =>{
        switch(data.action){
            case 'deleteAccount':
                setDeleteAccountPopup(true);
                break;
            default:
                break;
        }
    }
    return <ContextMenuTrigger id={CONTEXT_ID}><ViewCard>
        { deleteAccountPopup === true && <PopupWarning message={"정말 " + accountName + "계정을 삭제하시겠습니까?"} onAgree={deleteAccountByIDX} onDeny={()=>{setDeleteAccountPopup(false)}} onBackgroundClicked={()=>{setDeleteAccountPopup(false)}} /> }
        <ContextMenu id={CONTEXT_ID}>
            <MenuItem onClick={onClickMenu} data={{ action: 'deleteAccount', idx: idx }}>'{accountName}' 계정 삭제</MenuItem>
        </ContextMenu>
        
        <CardHeader><Span fontWeight="700" size="2.5rem" textColor="black">{accountName}</Span><Span fontWeight="500" size="1.5rem" textColor="black">수정일: {date}</Span></CardHeader>
        <CardBody>
            {OAuthServiceName && <CardBodyItem><Span fontWeight="700" size="1.4rem" textColor="darkred">(!) `{OAuthServiceName}`(으)로 소셜 로그인한 계정입니다.</Span></CardBodyItem>}
            <CardBodyItem><Span fontWeight="700" size="2rem" textColor="black">{OAuthServiceName && OAuthServiceName + " "}아이디</Span><Span size="2rem" textColor="black">{accountID}</Span></CardBodyItem>
            <CardBodyItem><Span fontWeight="700" size="2rem" textColor="black">{OAuthServiceName && OAuthServiceName + " "}비밀번호</Span><Span size="2rem" textColor="black">{accountPassword}</Span></CardBodyItem>
        </CardBody>
        
    </ViewCard></ContextMenuTrigger>
}