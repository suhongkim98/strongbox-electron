import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import FloatDiv from '../components/FloatDiv';
import { StrongboxDatabase } from '../StrongboxDatabase';
import sha256 from 'crypto-js/sha256';
import { Redirect } from 'react-router-dom';
import Span from '../components/Span';
import PinBox from '../components/PinBox';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TotalWrapper = styled.div`
height: 100vh;
display:flex;
justify-content:center;
align-items:center;
`;
const InnerWrapper = styled.div`
height:100%;
display:flex;
flex-direction:column;
justify-content:center;
align-items:center;
`;

const SpanWrapper = styled.div`
margin-bottom:20px;
`;
const PasswordInputPage:React.FC = () =>{
    const [name,setName] = useState(''); // name은 리렌더링이 필요하니 useState, 나머지는 리렌더링 필요없으므로 useRef사용
    const answer = useRef('');
    const salt = useRef('');
    const [redirect, setRedirect] = useState(false);
    
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

    const splitDate = (date: string) => {
        //문자열 가져와 잘라 json 반환
        const split = date.split(' ');
        const [calendar, time] = [split[0].split('-'), split[1].split(':')];
        return {year: parseInt(calendar[0]), month: parseInt(calendar[1]), day: parseInt(calendar[2]), hour: parseInt(time[0]), min: parseInt(time[1]), sec: parseInt(time[2])};
    }

    const getPinNumber = (result:string) =>{
        //입력을 다 했을 경우 해당 함수 호출
        const val = result + salt.current; // 사용자 입력한 것 + salt
        const userInput = sha256(val);

        const db = StrongboxDatabase.getInstance();
        db.select('BAN, COUNT', 'USERS_TB', 'IDX = ' + global.idx).then((result: any) => {
            const banDate = new Date(result[0].BAN);
            const current = new Date();
            const count = result[0].COUNT;
            console.log(count);
            if (current.getTime() < banDate.getTime()) {
                //아직 밴 시간이 되지 않았다면 기다리라고 팝업알림
                const delay = banDate.getTime() - current.getTime();
                toast.error('입력 제한 횟수를 초과하여 ' + (delay / 1000) + '초간 기다리셔야 합니다.', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else if (userInput.toString() === answer.current) {
                // 맞게 입력 했다면 리다이렉트하기
                console.log(" 로그인 성공");
                db.resetCount(global.idx).then((result) => { //count 0으로 초기화
                    global.key = val; // 키값 따로 저장 -> 대칭키암호 키로 사용
                    setRedirect(true);
                });
            } else if (count > 5) {
                // count가 5보다 크다면 밴하고 카운트 0으로 초기화
                db.banUser(global.idx).then((result) => {
                    //밴됐다고 알림팝업
                    toast.error('입력 제한 횟수를 초과하여 5분간 입력이 제한됩니다. ', {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                });
            } else {
                //틀렸다면
                console.log("로그인 실패");
                //count 업
                db.countUp(global.idx).then((result) => {
                    toast.error('핀번호가 일치하지 않습니다.', {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                });
            }
        });
    }

    if(redirect) return <Redirect to='/Main'/>
    return <TotalWrapper>
        <ToastContainer />
        <FloatDiv width="500px" height="220px" title={name} returnURL="/">
            <InnerWrapper>
            <SpanWrapper><Span size="3rem" textColor="darkred" fontWeight={700}>PIN 입력</Span></SpanWrapper>
            <PinBox getPinFunc={getPinNumber} autoFocusing={true}/>
            </InnerWrapper>
        </FloatDiv>
        </TotalWrapper>
}

export default PasswordInputPage;