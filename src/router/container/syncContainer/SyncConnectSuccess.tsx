import React, { useEffect, useState } from 'react';
import { MdCached } from 'react-icons/md';
import { IoMdPerson } from 'react-icons/io';
import styled from 'styled-components';
import Span from '../../../components/Span';
import theme from '../../../styles/theme';
import { useParams } from 'react-router-dom';
import {stompConnect, stompDisconnect, stompSendMessage} from '../../../modules/SyncWebSocketContainer';
import {StrongboxDatabase} from '../../../StrongboxDatabase';
import { AES, enc } from "crypto-js";

const TotalWrapper = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
`;
const ProfileWrapper = styled.div`
    height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;

`;
const TipWrapper = styled.div`
    height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    text-align: center;
`;
const SubmitBtn = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 5px 0 5px;
`;
const ButtonWrapper = styled.div`
    display: flex;
    flex-direction: row;
`;
const Icon = styled(Span)`
    display: flex;
    justify-content: center;
    align-items: center;
`;
interface SyncConnectSuccessProps {
    history: any;
}
const SyncConnectSuccess = ({history}: SyncConnectSuccessProps) => {
    const {otherPartName, vertificationCode}: any = useParams();
    const [isSyncAgree, setSyncAgree] = useState(false);
    const [isOtherPartAgree, setOtherPartAgree] = useState(false); // 상대방 동의 여부
    const [isFinish, setFinish] = useState(false);

    useEffect(() => {
        //stomp 구독하기
        stompConnect(onResponseMessage).then((result) => {
            stompSendMessage("CONNECT_SUCCESS", "연결 성공");
        }).catch((error) => {
            console.log(error);
        });
        

        return () => {
            console.log("동기화 이탈");
            if(isFinish){
                stompSendMessage("SYNC_FINISH", "동기화 종료"); //데이터를 잘 받았고 나는 나가겠다는 의미
            } else {
                stompSendMessage("SYNC_DENY", "동기화 거부");
            }
            stompDisconnect();
        }
    }, []);

    useEffect(() => {
        if(isOtherPartAgree && isSyncAgree) {
            //둘 다 동의한 경우
            const database = StrongboxDatabase.getInstance();
            database.getAllSyncData().then((result) => {
                //계정정보 상대방에게 건내주기
                const data = result;
                const accounts: any = result.accounts;
                for(let i = 0 ; i < accounts.length ; i++) {
                    const decrypted = (AES.decrypt(accounts[i].PASSWORD, global.key)).toString(enc.Utf8);
                    accounts[i].PASSWORD = decrypted; // 복호화
                }
                data.accounts = accounts;

                stompSendMessage("DATA", JSON.stringify(data));
            }).catch((error) => {
                console.error(error);
                onRedirect();
            });
            setSyncAgree(false); // 나는 동의여부 false로 바꾸어주고
        }
    }, [isOtherPartAgree, isSyncAgree]);

    const onResponseMessage = (response: any) => {
        // 구독 메시지가 도착했을 때 호출
        const message = JSON.parse(response.body);
        if(message.senderToken === global.syncInfo.token) {
            //내가 보낸 메시지는 무시
            return;
        }
        //상대방이 보낸 메시지


        if(message.type === "SYNC_DENY") {
            //동기화 거부를 한다면
            onRedirect(); // 나도 나갈랭
        } else if(message.type === "SYNC_AGREE") {
            //상대방이 동기화 동의를 한다면
            setOtherPartAgree(true);
        } else if(message.type === "DATA") {
            //상대방이 건내준 계정 정보
            const data = JSON.parse(message.message);
            //내 로컬db에 동기화하기
            console.log(data);
            setFinish(true);
            onRedirect();
            //
        }
    }
    const onAgreeSync = () => {
        stompSendMessage("SYNC_AGREE", "동기화 찬성");
        setSyncAgree(true);
    }
    const onRedirect = () => {
        history.replace("/Setting/syncRequestPage");
    }

    return (<TotalWrapper>
            <ProfileWrapper>
                <Span size="2.5rem" fontWeight="700">연결 성공!</Span>
                <Span size="5rem"><IoMdPerson /></Span>
                <Span size="2rem" fontWeight="700">상대방 이름: {otherPartName}</Span>
                <Span size="2rem" fontWeight="700">인증 번호: {vertificationCode}</Span>
            </ProfileWrapper>
            <TipWrapper>
                <Span size="1.4rem" textColor={theme.colors.backgroundMainColor}>
                    상대방의 이름과 인증 번호를 <Span size="1.4rem" textColor="darkred">꼭</Span> 확인하신 후<br />동기화 버튼을 눌러주세요.
                </Span>
                <Span size="1.4rem" textColor={theme.colors.backgroundMainColor}>이 단계에서 동기화를 하는 순간 상대방에게 계정정보가 보내집니다.</Span>
                <ButtonWrapper>
                    {!isSyncAgree ? 
                    <SubmitBtn onClick={onAgreeSync}><Icon size="2rem"><MdCached /></Icon><Span size="2rem" fontWeight="700">동기화하기</Span></SubmitBtn>
                    : <Span size="2rem" fontWeight="700">상대방 동의 대기 중</Span>
                    }
                    <SubmitBtn onClick={onRedirect}><Span size="2rem" fontWeight="700">취소</Span></SubmitBtn>
                </ButtonWrapper>
            </TipWrapper>
        </TotalWrapper>);
}

export default SyncConnectSuccess;
