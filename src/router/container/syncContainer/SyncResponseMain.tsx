
import React from 'react';
import { useForm } from 'react-hook-form';
import Span from '../../../components/Span';
import styled from '../../../styles/theme-components';
import {MdCached} from 'react-icons/md';
import axios from 'axios';

const TotalWrapper = styled.div`
    height: 100%;
    margin: 10px 0 0 0;
    display: flex;
    flex-direction: column;
    position:relative;
`;
const Form = styled.form`
    width: 100%;
    height: 100%;
    margin: 10px 0 0 0;
`;
const PinInput = styled.input`
    width: 100%;
    border-bottom: solid gray 1px;
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
interface FormProps {
    pinInput: string;
}
interface RequestMainProps {
    history: any;
}
const SyncResponseMain = ({history}: RequestMainProps) => {
    const { register, errors, handleSubmit } = useForm<FormProps>();
    const onSubmitEvent = (data:any) => {
        console.log(data.pinInput);
        const params = new URLSearchParams();
        params.append('name', global.name);
        params.append('vertificationCode', data.pinInput);

		axios.post('http://localhost:8080/sync/responseSync', params).then((response)=>{
            console.log(response.data);
            const roomId = response.data.data[0].roomId;
            const vertificationCode = response.data.data[0].vertificationCode;
            const token = response.data.data[1].token;
            const requestorName = response.data.data[0].requestorName;
            
            global.syncInfo = {roomId: roomId, token: token};

            history.push('/Setting/syncResponsePage/connectSuccess/' + requestorName + '/' +  + vertificationCode);
		}).catch((error)=>{
            console.log(error);
            // 방이 없다면 // 서버가 문제가 있다면
		});
    }
    return <TotalWrapper>
        <Span size="1.6rem" fontWeight="700">상대방이 제공한 인증 번호를 입력하세요</Span>
            <Form onSubmit={handleSubmit(onSubmitEvent)} noValidate>
                <PinInput type="text" name="pinInput" ref={register({ required: true })} />
                {errors.pinInput?.type === "required" && <Span size="1.4rem" textColor="red" fontWeight={600}><br/><br/>인증번호를 입력해주세요.</Span>}
                <TipWrapper>
                    <Span size="1.4rem"><br />상대방과 계정 정보를 동기화할 수 있습니다. 핀번호를 확인한 후 동기화버튼을 눌러주세요. <br /><br />
                        아이디가 일치한데 비밀번호가 다른경우 <Span textColor="red" size="1.4rem">가장 최근에 추가된 계정 정보</Span>로 업데이트 되니 참고하시기 바랍니다.</Span>
                </TipWrapper>
                <SubmitBtn><Icon size="2rem"><MdCached /></Icon><Span size="2rem" fontWeight="700">동기화하기</Span></SubmitBtn>
            </Form>
    </TotalWrapper>
}

export default SyncResponseMain;
