import React from 'react';
import styled from 'styled-components';
import theme from '../styles/theme';
import returnImg from '../images/return.svg';

interface FloatDivProps {
    children?:any;
    title:string;
}
const TotalWrapper = styled.div`
width:100%;
height:100%;
background-color:${theme.colors.containerMainColor};
box-shadow: 5px 5px 5px;
border-radius: 10px;

display:flex;
flex-direction:column;
`;
const HeaderWrapper = styled.div`
margin:15px;
`;
const HeaderContent = styled.div`
display:flex;
justify-content:space-between;
border-style:solid;
border-bottom-width:1px;
padding-bottom:14px;
`;
const BodyWrapper = styled.div`
margin:15px;
`;
const Span = styled.span`
font-size:2.5rem;
`;
const Img = styled.img`
width:25px;
height:25px;
`;

const FloatDiv = ({children,title}:FloatDivProps) =>{
    const returnPage = () =>{
        //이전 페이지로 돌아가기
    }
    return <TotalWrapper>
        <HeaderWrapper><HeaderContent><Span>{title}</Span><Img src={returnImg} alt="return" onClick={returnPage}></Img></HeaderContent></HeaderWrapper>
        <BodyWrapper>{children}</BodyWrapper>
    </TotalWrapper>
}

export default FloatDiv;