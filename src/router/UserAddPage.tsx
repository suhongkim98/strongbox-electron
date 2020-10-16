import React, { useState } from 'react';
import styled from 'styled-components';
import AnimInputBox from '../components/AnimInputBox';
import FloatDiv from '../components/FloatDiv';
import PinInputBox from '../components/PinInputBox';
import { useForm } from "react-hook-form";
import { StrongboxDatabase } from '../StrongboxDatabase';
import { Redirect } from 'react-router-dom';

const TotalWrapper = styled.div`
height: 100vh;
display:flex;
justify-content:center;
align-items:center;
`;
const Form = styled.form`
width:100%;
height:100%;
position:relative;
`;
const RowWrapper = styled.div`
width:100%;
display:flex;
text-align:center;
justify-content:center;
`;
const TipRowWrapper = styled(RowWrapper)`
position: absolute;
bottom:100px;
`;
const InputBoxWrapper = styled.div`
flex-grow:5;
`;
interface SpanProps{
    fontSize:any;
    fontColor?:string;
    weight?:number;
}
const Span = styled.span<SpanProps>`
${({fontSize})=>
    fontSize && `font-size:${fontSize};`
}
${({fontColor})=>
    fontColor && `color:${fontColor};`
}
${({weight})=>
    weight && `font-weight:${weight};`
}
`;

const SubmitBtn = styled.input`
border-style:solid;
border-radius:10px;
border-width:1px;
background-color:white;

width:200px;
height:40px;

position:absolute;
bottom:5px;

cursor:pointer;
`;
interface UserAddInput {
    nicknameInputBox:string;
    test:string;
  }
const UserAddPage:React.FC = () =>{
    const { register, errors, handleSubmit,setError } = useForm<UserAddInput>();
    const [redirect,setRedirect] = useState(false);
    const [pin,setPin] = useState("");

    const onSubmitEvent = (data:any) =>{
        const database = StrongboxDatabase.getInstance();
        database.addUser(data.nicknameInputBox, pin).then((result:any) =>{
            if(result === true){
                // 등록 성공
                setRedirect(true);
            }else{
                // 등록 실패 닉네임 중복  /  패스워드 글자 수 문제
                setError("nicknameInputBox",{
                    type: "failedRegister",
                    message: "닉네임이 중복되었거나 패스워드를 입력하지 않았습니다."
                });
            }
        }).catch((error)=>{
            console.log(error);
        });

    }

    const getPinNumber = (result:string) =>{
        //핀 다 입력하면 하위컴포넌트에서 getPinNumber 함수를 호출함
        setPin(result);
    }

    if(redirect) return <Redirect to='/'/> // 등록성공 시 홈으로 리다이렉트

    return <TotalWrapper>
        <FloatDiv width="500px" height="440px" title="사용자 추가" returnURL="/">
            <Form onSubmit={handleSubmit(onSubmitEvent)} noValidate>
            <RowWrapper>
                <InputBoxWrapper><AnimInputBox inputType="text" label="닉네임" name="nicknameInputBox" hookFormRef={register({required: true, maxLength: 10})}/></InputBoxWrapper>
            </RowWrapper>
            <RowWrapper><Span fontSize="1.5rem">핀번호 입력</Span><InputBoxWrapper><PinInputBox count={6} getPinFunc={getPinNumber}/></InputBoxWrapper></RowWrapper>

            <RowWrapper>
            {errors.nicknameInputBox?.type === "failedRegister" && <Span fontSize="1.5rem" fontColor="red" weight={600}><br/><br/>{errors.nicknameInputBox.message}</Span>}
            {errors.nicknameInputBox?.type === "maxLength" && <Span fontSize="1.5rem" fontColor="red" weight={600}><br/><br/>닉네임은 10글자 이하로 입력해주세요</Span>}
            </RowWrapper>

            <TipRowWrapper>
                <Span fontSize="1.2rem">( ! ) 사용자 정보는 컴퓨터 로컬DB에 암호화하여 저장됩니다.
                <br/><br/>핀번호는 데이터를 암호화하기 위한 중요한 암호입니다.<br/>분실하면 복구가 불가능하니 신중하게 설정해주세요.</Span>
            </TipRowWrapper>
            <RowWrapper><SubmitBtn type="submit" value="등록" /></RowWrapper>

            </Form>
            </FloatDiv>
    </TotalWrapper>

}

export default UserAddPage;