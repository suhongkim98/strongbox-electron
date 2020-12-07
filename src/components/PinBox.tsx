import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface PinBoxProps{
    getPinFunc: (pin:string)=> any;
    autoFocusing?: boolean;
}

const TotalWrapper = styled.div`
width:300px;
position:relative;
display:flex;
justify-content:space-evenly;
`;
const InputBox = styled.input`
position:absolute;
left:0;
top:0;
width:100%;
height:100%;

color: transparent; // 입력한거 안보이게
`;

interface BoxProps {
    isChecked: boolean;
}
const Box = styled.div<BoxProps>`
height: 40px;
width: 40px;
border: 1px solid grey;
border-radius:50%;

background-color: ${props=>props.isChecked ? '#565666' : 'white'};
`;

const PinBox = ({getPinFunc, autoFocusing}:PinBoxProps) =>{
    const PIN_LENGTH = 6; // pin번호 길이
    const [pinNumber, setPinNumber] = useState('');
    const [checked,setChecked] = useState([false, false, false, false, false, false])

    useEffect(()=>{
        if(pinNumber.length >= PIN_LENGTH){
            getPinFunc(pinNumber);
        }
        const tmp = [false, false, false, false, false, false];
        for(let i = 0 ; i < pinNumber.length ; i++){
            tmp[i] = true;
        }
        setChecked(tmp);
    },[pinNumber]);

    const onChangeInput = (e:any) =>{
        setPinNumber(e.target.value);
    }

    return <TotalWrapper><InputBox type="text" onChange={onChangeInput} maxLength={PIN_LENGTH} autoFocus={autoFocusing} />
    <Box isChecked={checked[0]}/><Box isChecked={checked[1]}/><Box isChecked={checked[2]}/>
    <Box isChecked={checked[3]}/><Box isChecked={checked[4]}/><Box isChecked={checked[5]}/>
    </TotalWrapper>
}

export default PinBox;