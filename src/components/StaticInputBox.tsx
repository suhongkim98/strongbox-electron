import React from 'react';
import styled from 'styled-components';


interface InputBoxProps{
label:string;
inputType:string;
name?:any;
hookFormRef?:any;
onChange?: (e: any) => any;
placeholder ?: string;
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
    top: -20px;
  left: 0;
  padding: 10px 0;
  font-size: 12px;
  font-weight:700;
  color: black;
  pointer-events: none;
  transition: .2s;
}
`;

//쓸떈 form 태그 안에 넣자
const StaticInputBox = ({label,inputType,name,hookFormRef, onChange, placeholder}:InputBoxProps) =>{
    return <InputBox><input placeholder={placeholder} type={inputType} name={name} required ref={hookFormRef} onChange={onChange}/><label>{label}</label></InputBox>
}

export default StaticInputBox;