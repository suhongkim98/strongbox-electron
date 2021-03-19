import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import Span from '../components/Span';
import { RootState } from '../modules';
import { updateUserAsync } from '../modules/userList';
import theme from '../styles/theme';


const TotalWrapper = styled.div`
width:100%;
height:100%;

display:flex;
flex-direction:column;
justify-content:center;
align-items:center;

`;

const SpanWrapper = styled.div `
margin-bottom:50px;
`;

const UserSelectWrapper = styled.div `
width:400px;
height:150px;
margin-bottom:40px;

border-style:solid;
border-color:white;
border-width:1px;
`;
const Scroll = styled.div`
width:100%;
height:100%;
overflow: auto;
::-webkit-scrollbar{
    width:10px;
    display:none;
}
`;
const Row = styled.div`
:hover span{
    color:aqua;
}
`;
const Content = styled.div`
border-style:solid;
border-color:grey;
border-bottom-width:1px;
background-color:${theme.colors.backgroundMainColor};

margin: 20px;
padding-bottom:10px;
`;
const UserSelectPage:React.FC = () =>{
    const userList = useSelector((state: RootState) => state.userList.list);
    const [list, setList] = useState();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(updateUserAsync());
    }, [dispatch]);

    useEffect(() => {
        const tmp =userList.map((data:any)=>{
            return <NavLink to = '/PasswordInputPage' key={data.IDX} replace>
                <Row onClick={()=>{global.idx = data.IDX}}><Content><Span size="1.6rem" textColor="white">{data.NAME}</Span></Content></Row>
            </NavLink>});
        setList(tmp);
    }, [userList]);

    return <TotalWrapper>
        <SpanWrapper><Span textColor="white" size="4rem" fontWeight="700">사용자 선택</Span></SpanWrapper>
        <UserSelectWrapper><Scroll>{list}</Scroll></UserSelectWrapper>
        <SpanWrapper><NavLink to="/UserAdd"><Span textColor={theme.colors.lightPink} size="1.5rem" >사용자 추가</Span></NavLink></SpanWrapper>
        <SpanWrapper><Span textColor="white" size="1.5rem">로그인 상태 유지</Span></SpanWrapper>
    </TotalWrapper>;
}

export default UserSelectPage;