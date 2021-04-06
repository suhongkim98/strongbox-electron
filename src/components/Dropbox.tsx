import React from 'react';
import styled from 'styled-components';

const Select = styled.select`
  width: 100%;
  height: 35px;
  background: white;
  color: gray;
  font-size: 14px;
  border: none;
  
  border-style:solid;
  border-color:black;
  border-width:1px;

  option {
    color: black;
    background: white;
    display: flex;
    white-space: pre;
    min-height: 20px;
    padding: 0px 2px 1px;
  }
`;
interface DropboxProps {
    name?: string;
    defaultOptionName?:string;
    children: any;
    setSelectedFunc: (value: any) => any;
    onClick?:any;
}
const Dropbox = ({children, name, setSelectedFunc, defaultOptionName, onClick}: DropboxProps) => {
    return <Select name={name} onChange={(e:any)=>{setSelectedFunc(e.target.value)}} onClick={onClick}>
        <option value={-1}>{defaultOptionName ? defaultOptionName : "선택"}</option>
        {children}
    </Select>;
};

export default Dropbox;