import React from 'react';
import styled from 'styled-components';
import theme from '../styles/theme';
import returnImg from '../images/return.svg';
import { NavLink } from 'react-router-dom';

interface FloatDivProps {
    width:any;
    height?:any;
    children?:any;
    title:string;
    returnURL?:string;
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
background-color:${theme.colors.containerMainColor};
box-shadow: 0 15px 25px rgba(0,0,0,.6);

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
height:100%;
margin:15px;
`;
const Span = styled.span`
font-size:2.5rem;
font-weight:600;
`;
const Img = styled.img`
width:25px;
height:25px;
`;

const FloatDiv = ({children,title,returnURL,width,height}:FloatDivProps) =>{
    return <TotalWrapper width={width} height={height}>
        <HeaderWrapper><HeaderContent>
            <Span>{title}</Span>
            {
                returnURL && <NavLink to={returnURL}><Img src={returnImg} alt="return"></Img></NavLink>
            }
            </HeaderContent></HeaderWrapper>
        <BodyWrapper>{children}</BodyWrapper>
    </TotalWrapper>
}

export default FloatDiv;