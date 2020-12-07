import React from 'react';
import styled from 'styled-components';
import returnImg from '../images/return.svg';
import { NavLink } from 'react-router-dom';
import Span from './Span';

interface FloatDivProps {
    width:any;
    height?:any;
    children?:any;
    title:string;
    returnURL?:string;
    returnFunc?:any;
}
interface TotalWrapperProps{
    width:any;
    height?:any;
}
const TotalWrapper = styled.div<TotalWrapperProps>`
width:${props=>props.width};
${({height}) => 
    height &&
    `height:${height};`
}
background-color:white;
box-shadow: 0 6px 12px rgba(0,0,0,.175);

display:flex;
flex-direction:column;
`;
const HeaderWrapper = styled.div`
height:50px;
background-color:#F2F2F2;
padding: 0 15px 0 15px;
display:flex;
align-items:center;

border-style:solid;
border-bottom-width:1px;
`;
const HeaderContent = styled.div`
width:100%;
display:flex;
justify-content:space-between;
`;
const BodyWrapper = styled.div`
height:100%;
margin:15px;
`;
const Img = styled.img`
width:25px;
height:25px;
`;

const FloatDiv = ({children,title,returnURL,returnFunc,width,height}:FloatDivProps) =>{
    return <TotalWrapper width={width} height={height}>
        <HeaderWrapper><HeaderContent>
            <Span fontWeight={600} size="2.5rem">{title}</Span>
            { returnURL && <NavLink to={returnURL}><Img src={returnImg} alt="return"></Img></NavLink> }
            { returnFunc && <div onClick={returnFunc}><Img src={returnImg} alt="return"></Img></div> }
            </HeaderContent></HeaderWrapper>
        <BodyWrapper>{children}</BodyWrapper>
    </TotalWrapper>
}

export default FloatDiv;