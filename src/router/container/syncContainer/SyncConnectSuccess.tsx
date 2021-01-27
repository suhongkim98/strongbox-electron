import React from 'react';
import { MdCached } from 'react-icons/md';
import { IoMdPerson } from 'react-icons/io';
import styled from 'styled-components';
import Span from '../../../components/Span';
import theme from '../../../styles/theme';

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
const SubmitBtn = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
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
const SyncConnectSuccess = () => {
    return (<TotalWrapper>
            <ProfileWrapper>
                <Span size="2.5rem" fontWeight="700">연결 성공!</Span>
                <Span size="5rem"><IoMdPerson /></Span>
                <Span size="2rem" fontWeight="700">이름: </Span>
                <Span size="2rem" fontWeight="700">인증 번호: </Span>
            </ProfileWrapper>
            <TipWrapper>
                <Span size="1.4rem" textColor={theme.colors.backgroundMainColor}>
                    상대방의 이름과 인증 번호를 <Span size="1.4rem" textColor="darkred">꼭</Span> 확인하신 후<br />동기화 버튼을 눌러주세요.
                </Span>
                <Span size="1.4rem" textColor={theme.colors.backgroundMainColor}>이 단계에서 동기화를 하는 순간 상대방에게 계정정보가 보내집니다.</Span>
                <ButtonWrapper>
                    <SubmitBtn><Icon size="2rem"><MdCached /></Icon><Span size="2rem" fontWeight="700">동기화하기</Span></SubmitBtn>
                    <SubmitBtn><Span size="2rem" fontWeight="700">취소</Span></SubmitBtn>
                </ButtonWrapper>
            </TipWrapper>
        </TotalWrapper>);
}

export default SyncConnectSuccess;
