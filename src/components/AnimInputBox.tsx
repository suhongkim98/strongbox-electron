import React from 'react';
import styled from 'styled-components';


interface InputBoxProps{
label:string;
inputType:string;
name?:any;
hookFormRef?:any;
}
const InputBox = styled.div`
position: relative;
input{
    width: 100%;
  padding: 10px 0;
  font-size: 16px;
  color: black;
  margin-bottom: 30px;
  border: none;
  border-bottom: 1px solid black;
  outline: none;
  background: transparent;
}
label{
    position: absolute;
  top:0;
  left: 0;
  padding: 10px 0;
  font-size: 16px;
  color: black;
  pointer-events: none;
  transition: .2s;
}
input:focus ~ label, input:valid ~ label{
    top: -20px;
  left: 0;
  color: navy;
  font-size: 12px;
  font-weight:700;
}
`;

//쓸떈 form 태그 안에 넣자
const AnimInputBox = ({label,inputType,name,hookFormRef}:InputBoxProps) =>{
    return <InputBox><input type={inputType} name={name} required ref={hookFormRef}/><label>{label}</label></InputBox>
}

export default AnimInputBox;