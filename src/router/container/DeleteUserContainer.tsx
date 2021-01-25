import React from 'react';
import styled from 'styled-components';
import Span from '../../components/Span';
import returnImg from '../../images/return.svg';
import { NavLink } from 'react-router-dom';
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
const DeleteUserContainer = () => {
    return (<TotalWrapper>
        <HeaderWrapper><Span size="2.5rem" fontWeight="700">사용자 삭제</Span><NavLink to="/Main"><Img src={returnImg} alt="return"/></NavLink></HeaderWrapper>
        <BodyWrapper>2
        </BodyWrapper>
    </TotalWrapper>);
}

export default DeleteUserContainer;
