import React from 'react';
import styled from 'styled-components';
import PopupFloatDiv from './PopupFloatDiv';


interface AddServcePopupProps{
    onBackgroundClicked:any;
}
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
const onButtonClicked = (event:any) =>{
    event.preventDefault();

}
const AddServcePopup = ({onBackgroundClicked}:AddServcePopupProps) =>{
    return <PopupFloatDiv 
    title="폴더에 계정 추가"
    onBackgroundClicked={onBackgroundClicked}>
        <form onSubmit={onButtonClicked}>
        <FooterWrapper><Button>저장</Button></FooterWrapper>
        </form>
    </PopupFloatDiv>    
}

export default AddServcePopup;