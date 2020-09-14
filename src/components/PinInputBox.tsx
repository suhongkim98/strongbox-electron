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
    const [index,setIndex] = useState(0);

    const onClickEvent = (e:any) => {
        inputRef.current[index].focus();
    }

    const onKeyUpEvent = (e:any) =>{
        if(e.target.value.length >= 1){
            setIndex(index + 1);
            console.log('다음' + index);
        }
        e.preventDefault();
    }

    useEffect(()=>{
        console.log("index바뀜"+index);
    },[index]);
    useEffect(() => {
        const list:any = [];
        inputRef.current = new Array(count);
        for(let i = 0 ; i < count ; i++){
            list.push(<Input type="password" maxLength={1} onClick={onClickEvent} onKeyUp={onKeyUpEvent} key={i} ref = {el => inputRef.current[i] = el}/>);
        }
        setResult(list);
    },[]);

    return <TotalWrapper>{result}</TotalWrapper>
}

export default PinInputBox;