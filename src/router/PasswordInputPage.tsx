import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import FloatDiv from '../components/FloatDiv';
import PinInputBox from '../components/PinInputBox';
import { StrongboxDatabase } from '../StrongboxDatabase';
import sha256 from 'crypto-js/sha256';

const TotalWrapper = styled.div`
height: 100vh;
display:flex;
justify-content:center;
align-items:center;
`;
const FloatDivWrapper = styled.div`
width:500px;
height:220px;
`;
const InnerWrapper = styled.div`
height:100%;
display:flex;
flex-direction:column;
align-items:center;
`;
interface SpanProps{
    fontSize:any;
    fontWeight?:any;
    fontColor:any;
}
const Span = styled.span<SpanProps>`
${({fontSize})=>
    fontSize && `font-size:${fontSize};`
}
${({fontWeight})=>
    fontWeight && `font-weight:${fontWeight};`
}
${({fontColor})=>
    fontColor && `color:${fontColor};`
}
`;
const SpanWrapper = styled.div`
margin-bottom:20px;
`;
const PasswordInputPage:React.FC = () =>{
    const [name,setName] = useState(''); // name은 리렌더링이 필요하니 useState, 나머지는 리렌더링 필요없으므로 useRef사용
    const answer = useRef('');
    const salt = useRef('');
    
    useEffect(() => {
        const database = StrongboxDatabase.getInstance();
        database.select("NAME,PASSWORD,SALT","USERS_TB","IDX = " + global.idx).then((result:any)=>{
            setName(result[0].NAME);
            answer.current = result[0].PASSWORD;
            salt.current = result[0].SALT;
        }).catch(error => {
            console.log(error);
        });

      }
    ,[]);

    const getPinNumber = (result:string) =>{
        //입력을 다 했을 경우 해당 함수 호출
        const val = result + salt.current; // 사용자 입력한 것 + salt
        const userInput = sha256(val);
        if(userInput.toString() === answer.current){
            // 맞게 입력 했다면 리다이렉트하기
            console.log(" 로그인 성공");
            global.key = val; // 키값 따로 저장 -> 대칭키암호 키로 사용
        }else{
            //틀렸다면
            console.log("로그인 실패");
        }
    }

    return <TotalWrapper>
        <FloatDivWrapper><FloatDiv title={name} returnURL="/">
            <InnerWrapper>
            <SpanWrapper><Span fontSize="3rem" fontColor="darkred" fontWeight={700}>PIN 입력</Span></SpanWrapper>
            <PinInputBox count={6} getPinFunc={getPinNumber} />
            </InnerWrapper>
        </FloatDiv></FloatDivWrapper>
        </TotalWrapper>
}

export default PasswordInputPage;