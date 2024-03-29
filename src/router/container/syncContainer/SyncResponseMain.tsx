import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Span from "../../../components/Span";
import styled from "../../../styles/theme-components";
import { MdCached } from "react-icons/md";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SERVER_NAME } from "../../../environment";
import { Redirect } from "react-router";
const TotalWrapper = styled.div`
  height: 100%;
  margin: 10px 0 0 0;
  display: flex;
  flex-direction: column;
  position: relative;
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
  transform: translateX(-50%);
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
const SyncResponseMain = ({ history }: RequestMainProps) => {
  const { register, errors, handleSubmit } = useForm<FormProps>();
  const [redirect, setRedirect] = useState("");
  const onSubmitEvent = (data: any) => {
    console.log(data.pinInput);

    axios
      .post(SERVER_NAME + "/sync/responseSync", {
        name: global.nickName,
        vertificationCode: data.pinInput,
      })
      .then((response) => {
        console.log(response.data);
        const roomId = response.data.data[0].roomId;
        const vertificationCode = response.data.data[0].vertificationCode;
        const token = response.data.data[1].token;
        const requestorName = response.data.data[0].requestorName;

        global.syncInfo = { roomId: roomId, token: token };

        setRedirect(
          "/Setting/syncResponsePage/connectSuccess/" +
            requestorName +
            "/" +
            +vertificationCode
        );
      })
      .catch((error) => {
        console.log(error);
        // 방이 없다면 // 서버가 문제가 있다면
        if (error.response) {
          // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          if (error.response.status === 404) {
            // 방이 없을 경우
            toast.error("인증 번호가 일치하지 않습니다.", {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        } else if (error.request) {
          // 요청이 이루어 졌으나 응답을 받지 못했습니다.
          // `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
          // Node.js의 http.ClientRequest 인스턴스입니다.
          console.log(error.request);
          toast.error("동기화 서버가 점검 중입니다.", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
          console.log("Error", error.message);
          toast.error("동기화 서버가 점검 중입니다.", {
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
  };
  if (redirect !== "") return <Redirect to={redirect} />;
  return (
    <TotalWrapper>
      <ToastContainer />
      <Span size="1.6rem" fontWeight="700">
        다른 기기가 제공한 인증 번호를 입력하세요
      </Span>
      <Form onSubmit={handleSubmit(onSubmitEvent)} noValidate>
        <PinInput
          type="text"
          name="pinInput"
          ref={register({ required: true })}
        />
        {errors.pinInput?.type === "required" && (
          <Span size="1.4rem" textColor="red" fontWeight={600}>
            <br />
            <br />
            인증번호를 입력해주세요.
          </Span>
        )}
        <TipWrapper>
          <Span size="1.4rem">
            <br />
            다른 기기와 계정 정보를 동기화할 수 있습니다. 핀번호를 확인한 후
            동기화버튼을 눌러주세요. <br />
            <br />
            계정 이름이 같은 경우{" "}
            <Span textColor="red" size="1.4rem">
              가장 최근에 추가된 계정 정보
            </Span>
            로 업데이트 되니 참고하시기 바랍니다.
          </Span>
        </TipWrapper>
        <SubmitBtn>
          <Icon size="2rem">
            <MdCached />
          </Icon>
          <Span size="2rem" fontWeight="700">
            동기화하기
          </Span>
        </SubmitBtn>
      </Form>
    </TotalWrapper>
  );
};

export default SyncResponseMain;
