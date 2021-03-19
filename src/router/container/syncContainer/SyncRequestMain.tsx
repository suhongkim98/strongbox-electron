import React, { useState } from 'react';
import Span from '../../../components/Span';
import styled from '../../../styles/theme-components';
import {MdCached} from 'react-icons/md';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SERVER_NAME } from '../../../environment';
import { Redirect } from 'react-router';

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
    const [redirect, setRedirect] = useState('');
    const onSubmitEvent = () => {
        const params = new URLSearchParams();
		params.append('name', global.name);
		axios.post(SERVER_NAME + '/sync/requestSync', params).then((response)=>{
            console.log(response.data);
            const roomId = response.data.data[0].roomId;
            const vertificationCode = response.data.data[0].vertificationCode;
            const token = response.data.data[1].token;

            global.syncInfo = {roomId: roomId, token: token};

            setRedirect('/Setting/SyncRequestPage/pin/' + vertificationCode);
		}).catch((error)=>{
            console.log(error);
            if (error.response) {
                // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
                toast.error('방 생성에 문제가 있습니다.', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
              }
              else if (error.request) {
                // 요청이 이루어 졌으나 응답을 받지 못했습니다.
                // `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
                // Node.js의 http.ClientRequest 인스턴스입니다.
                console.log(error.request);
                toast.error('동기화 서버에 문제가 있습니다.', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
              }
              else {
                // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
                console.log('Error', error.message);
                toast.error('동기화 서버에 문제가 있습니다.', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
              }
		});
    }
    if(redirect !== '') return <Redirect to={redirect} />;
    return <TotalWrapper>
            <ToastContainer />
            <TipWrapper>
                <Span size="1.4rem"><br />상대방과 계정 정보를 동기화할 수 있습니다. 동기화 요청 버튼을 눌러주세요. <br /><br />
                    아이디가 일치한데 비밀번호가 다른경우 <Span textColor="red" size="1.4rem">가장 최근에 추가된 계정 정보</Span>로 업데이트 되니 참고하시기 바랍니다.</Span>
            </TipWrapper>
            <SubmitBtn onClick={onSubmitEvent}><Icon size="2rem"><MdCached /></Icon><Span size="2rem" fontWeight="700">동기화 요청</Span></SubmitBtn>
    </TotalWrapper>
}

export default SyncRequestMain;