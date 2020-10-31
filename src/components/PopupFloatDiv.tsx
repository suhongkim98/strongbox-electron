import React from 'react';
import styled from 'styled-components';
import FloatDiv from './FloatDiv';
interface PopupFloatDivProps{
    onBackgroundClicked:any;
    title:string;
    children?:any;
}

const TotalWrapper = styled.div`
position: fixed;
top: 0;
left: 0;
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
const BodyWrapper = styled.div`
`;


const PopupFloatDiv = ({onBackgroundClicked, title, children}:PopupFloatDivProps) =>{
    
    return <TotalWrapper><Background onClick={onBackgroundClicked} />
    <FloatWrapper>
        <FloatDiv width="100%" title={title} returnFunc={onBackgroundClicked}>
            <BodyWrapper>{children}</BodyWrapper>
        </FloatDiv>
    </FloatWrapper>
    </TotalWrapper>
}

export default PopupFloatDiv;