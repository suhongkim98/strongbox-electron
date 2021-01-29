import React from 'react';
import Span from '../../../components/Span';
import styled from '../../../styles/theme-components';
import {MdCached} from 'react-icons/md';

const TotalWrapper = styled.div`
    height: 100%;
    margin: 10px 0 0 0;
    display: flex;
    flex-direction: column;
    position:relative;
`;
const SubmitBtn = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 30px;
    left: 50%; 
    transform:translateX(-50%);
`;
const Icon = styled(Span)`
display: flex;
justify-content: center;
align-items: center;
`;
const TipWrapper = styled.div``;
interface RequestMainProps {
    history: any;
}
const SyncRequestMain = ({history}: RequestMainProps) => {
    const onSubmitEvent = () => {
        history.push('/Setting/SyncRequestPage/pin');
    }
    return <TotalWrapper>
            <TipWrapper>
                <Span size="1.4rem"><br />상대방과 계정 정보를 동기화할 수 있습니다. 동기화 요청 버튼을 눌러주세요. <br /><br />
                    아이디가 일치한데 비밀번호가 다른경우 <Span textColor="red" size="1.4rem">가장 최근에 추가된 계정 정보</Span>로 업데이트 되니 참고하시기 바랍니다.</Span>
            </TipWrapper>
            <SubmitBtn onClick={onSubmitEvent}><Icon size="2rem"><MdCached /></Icon><Span size="2rem" fontWeight="700">동기화 요청</Span></SubmitBtn>
    </TotalWrapper>
}

export default SyncRequestMain;