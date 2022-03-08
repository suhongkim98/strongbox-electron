import React, { useState } from 'react';
import styled from 'styled-components';
import Span from '../../components/Span';
import returnImg from '../../images/return.svg';
import { NavLink, Redirect } from 'react-router-dom';
import { StrongboxDatabase } from '../../StrongboxDatabase';
import PopupWarning from '../../components/PopupWarning';
import { useDispatch } from 'react-redux';
import { updateUserAsync } from '../../modules/userList';
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
const SubmitBtn = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 30px;
    left: 50%; 
    transform:translateX(-50%);
`;
const TipWrapper = styled.div``;
const DeleteUserContainer = () => {
    const [redirect, setRedirect] = useState('');
    const [deleteUserPopup, setDeleteUserPopup] = useState(false);
    const dispatch = useDispatch();
    
    const onDeleteUser = () => {
        const db = StrongboxDatabase.getInstance();
        db.deleteUser(global.idx).then((result) => {
            dispatch(updateUserAsync());
            global.key = '';
            global.idx = -1;
            global.nickName = '';
            setRedirect('/');
        });
    }


    if(redirect !== '') return <Redirect to={redirect} />;
    return (<TotalWrapper>
        {
            deleteUserPopup === true && <PopupWarning message="정말 사용자를 삭제하시겠습니까? 복구가 불가능합니다." onAgree={onDeleteUser} onDeny={()=>{setDeleteUserPopup(false)}} onBackgroundClicked={()=>{setDeleteUserPopup(false)}} />
        }
        <HeaderWrapper><Span size="2.5rem" fontWeight="700">사용자 삭제</Span><NavLink replace to="/Main"><Img src={returnImg} alt="return"/></NavLink></HeaderWrapper>
        <BodyWrapper>
            <TipWrapper>
                    <Span size="1.4rem"><br />한번 삭제한 계정 정보는 복구가 불가능합니다.<br/><br/>삭제를 원하신다면 사용자 삭제 버튼을 눌러주세요.</Span>
            </TipWrapper>
            <SubmitBtn onClick={() => {setDeleteUserPopup(true);}}><Span size="2rem" fontWeight="700" textColor="darkred">사용자 삭제</Span></SubmitBtn>
        </BodyWrapper>
    </TotalWrapper>);
}

export default DeleteUserContainer;
