import React from 'react';
import styled from 'styled-components';
import Span from './Span';
import warningSVG from '../images/warning.svg';
import returnSVG from '../images/return.svg';
import theme from '../styles/theme';
interface PopupWarningProps{
    onBackgroundClicked:any;
    message:string;
    onAgree:any;
    onDeny:any;
}

const TotalWrapper = styled.div`
position: fixed;
z-index: 2;
width:100%;
height:100%;
top:0px;
left:0px;

display:flex;
justify-content:center;
align-items:center;
`;
const Background = styled.div`
width:100%;
height:100%;
background-color:black;
opacity:0.9;
`;
const FloatWrapper = styled.div`
position: absolute;
width:450px;
min-height:180px; //높이는 메세지 길이에 따라 늘어날 수 있어야 함
background-color:${theme.colors.containerMainColor};
box-shadow: 0 6px 12px rgba(0,0,0,.175);

display:flex;
flex-direction:column;
justify-content:space-between;

border-style:solid;
border-width:1px;
border-color:black;
`;
const HeaderWrapper = styled.div`
width:100%;
height:40px;
display:flex;
justify-content:space-between;
align-items:center;
`;
const HeaderInnerWrapper = styled.div`
margin:0 15px 0 15px;
`;
const BodyWrapper = styled.div`
width:100%;
text-align:center;
`;
const FooterWrapper = styled.div`
width:100%;
height:60px;
display:flex;
justify-content:center;
`;
interface ButtonProps {
    backgroundColor:any;
    textColor:any;
}
const Button = styled.button<ButtonProps>`
width:150px;
height:40px;
background-color:${props=>props.backgroundColor};
margin:15px;

border-style:solid;
border-width:1px;
border-color:black;
border-radius: 5px;

color:${props=>props.textColor};
font-size:1.5rem;
text-align:center;
text-decoration:none;
display:inline-block;
cursor:pointer;

margin: 4px 2px;
`;
const Img = styled.img`
width:25px;
height:25px;
`;
//모든 팝업창은 이 컨포넌트를 백그라운드로 사용하자
const PopupWarning = ({onBackgroundClicked, message, onAgree, onDeny}:PopupWarningProps) =>{

    return <TotalWrapper><Background onClick={onBackgroundClicked} />
    <FloatWrapper>
        <HeaderWrapper><HeaderInnerWrapper><Img src={warningSVG} alt="warning"/></HeaderInnerWrapper><HeaderInnerWrapper onClick={onBackgroundClicked}><Img src={returnSVG} alt="return"/></HeaderInnerWrapper></HeaderWrapper>
        <BodyWrapper><Span textColor="Black" size="1.5rem">{message}</Span></BodyWrapper>
        <FooterWrapper><Button backgroundColor="darkred" textColor="white" onClick={onAgree}>예</Button><Button backgroundColor="white" textColor="black" onClick={onDeny}>아니오</Button></FooterWrapper>
    </FloatWrapper>
    </TotalWrapper>
}

export default PopupWarning;