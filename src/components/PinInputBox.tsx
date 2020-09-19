import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';


interface PinInputBoxProps{
    count:number;
}

const TotalWrapper = styled.div`
display:flex;
justify-content:space-evenly;
`;
const Input = styled.input`
height: 40px;
width: 40px;
text-align: center;
font-size: 2em;
border: 1px solid grey;
border-radius:50%;
:focus{
border-color: black;
}
`;
//쓸떈 form 태그 안에 넣자
const PinInputBox = ({count}:PinInputBoxProps) =>{
    const inputRef:any = useRef([]);
    const [result,setResult] = useState([]);
    let index:number = 0;

    const focusNext = () => {
        inputRef.current[index].focus();
        
    }

    const onKeyUpEvent = (e:any) =>{
        if(e.target.value.length >= 1){
            index += 1;
            if(index > count - 1){
                inputRef.current[index - 1].blur();
                index = 0;
            }
            else focusNext();
        }
        e.preventDefault();
    }

    const onFocusEvent = () =>{
        if(inputRef.current[index].value !== ''){
            //이미 한번 입력한 상태에서 다시 입력할 경우 input 초기화
            for(let i = 0 ; i < count ; i++){
                inputRef.current[i].value = '';
            }
        }
        else focusNext();
    }

    useEffect(() => {
        const list:any = [];
        inputRef.current = new Array(count);
        for(let i = 0 ; i < count ; i++){//ref배열
            list.push(<Input type="text" required maxLength={1} onClick={focusNext} onKeyUp={onKeyUpEvent} onFocus={onFocusEvent} key={i} ref = {el => inputRef.current[i] = el}/>);
        }
        setResult(list);
    },[]);

    return <TotalWrapper>{result}</TotalWrapper>
}

export default PinInputBox;