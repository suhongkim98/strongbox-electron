import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Span from '../../../components/Span';
import { useInterval } from '../../../modules/customHook';
import theme from '../../../styles/theme';

const TotalWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 100%;
`;
const InnerWrapper = styled.div`
    height: 50px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 80px;
`;
interface SyncRequestPinProps {
    history: any;
}
const SyncRequestPin = ({history}: SyncRequestPinProps) => {
    const {vertificationCode}: any = useParams();
    
    const [count, setCount] = useState(30);

    useInterval(() =>{ // 커스텀 훅 사용
        setCount(count - 1);
    }, count > 0 ? 1000 : null); // 카운트가 0보다 크면 1초마다 반복

    useEffect(() => {
        if(count <= 0) {
            // 카운트 종료 시
            history.push("/Setting/syncRequestPage");
        }
    }, [count, history]);
    
    useEffect(() => {
        //stomp 구독하기

        //
        return () => {
            console.log("이탈");
            global.syncInfo = {}; // 초기화
        }
    }, []);
    
    return (<TotalWrapper>
        <InnerWrapper>
            <div>
                <Span size="2.5rem" fontWeight="700">ACCONG BOX</Span>
            </div>
            <div>
                <Span size="2rem">{global.name}</Span>
            </div>
        </InnerWrapper>
        <InnerWrapper>
            <div>
                <Span size="2rem">인증 번호</Span>
            </div>
            <div>
                <Span size="5rem" textColor={theme.colors.backgroundMainColor}  fontWeight="700">{vertificationCode}</Span>
            </div>
        </InnerWrapper>
        <InnerWrapper>
            <div>
                <Span size="2rem">유효시간 내에 인증 번호를 입력하세요.</Span>
            </div>
            <div>
                <Span size="2.5rem" textColor="red"  fontWeight="700">{count}</Span>
            </div>
        </InnerWrapper>
    </TotalWrapper>);
}

export default SyncRequestPin;
