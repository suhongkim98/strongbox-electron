import React from 'react';
import styled from 'styled-components';
import FloatDiv from './FloatDiv';
interface PopupFloatDivProps{
    onBackgroundClicked:any;
    onButtonClicked:any;
    title:string;
    buttonName:string;

    children?:any;
}

const TotalWrapper = styled.div`
position: fixed;
z-index: 2;
width:100%;
height:100%;
display:flex;
justify-content:center;
align-items:center;
`;
const Background = styled.div`
width:100%;
height:100%;
background-color:black;
opacity:0.5;
`;
const FloatWrapper = styled.div`
position: absolute;
width:550px;
`;
const FloatDivInnerWrapper = styled.div`
`;
const BodyWrapper = styled.div`
`;
const FooterWrapper = styled.div`
display:flex;
justify-content:center;
align-items:center;
`;
const Button = styled.button`
width:190px;
height:40px;
background-color:white;
color:black;
margin-top:10px;
cursor:pointer;

border-style:solid;
border-width:1px;
border-color:black;
border-radius:5px;
`;

const PopupFloatDiv = ({onBackgroundClicked, onButtonClicked, title, children, buttonName}:PopupFloatDivProps) =>{
    
    return <TotalWrapper><Background onClick={onBackgroundClicked} />
    <FloatWrapper>
        <FloatDiv width="100%" title={title} returnURL={onBackgroundClicked}>
            <FloatDivInnerWrapper>
            <BodyWrapper>{children}</BodyWrapper>
            <FooterWrapper><Button onClick={onButtonClicked}>{buttonName}</Button></FooterWrapper>
            </FloatDivInnerWrapper>
        </FloatDiv>
    </FloatWrapper>
    </TotalWrapper>
}

export default PopupFloatDiv;