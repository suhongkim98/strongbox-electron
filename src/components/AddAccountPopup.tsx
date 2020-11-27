import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '../modules';
import { StrongboxDatabase } from '../StrongboxDatabase';
import styled from '../styles/theme-components';
import AnimInputBox from './AnimInputBox';
import PopupFloatDiv from './PopupFloatDiv';

interface AddAccountPopupProps{
    onBackgroundClicked:any;
}

const SubmitBtn = styled.button`
`;
interface AddAccountUseFormProps {
    accountName:string;
    id:string;
    pw:string;
}
const AddAccountPopup = ({onBackgroundClicked}:AddAccountPopupProps) =>{
    const selectedService = useSelector((state: RootState)=>state.selectedService.itemIndex);
    const { register, errors, handleSubmit } = useForm<AddAccountUseFormProps>();
    const [isOAuth, setOAuth] = useState(false);

    const onSubmitIdPassword = (data:any) =>{
        //database.addAccount(selectedService['idx'],"부캐",{OAuthAccountIDX:2}); // oauth방식
        //event.preventDefault();
        const database = StrongboxDatabase.getInstance();
        database.addAccount(selectedService['idx'],data.accountName,{id:data.id,password:data.pw}); //id pw방식
        onBackgroundClicked(); // 창닫기
    }

    const onSubmitOAuth = (data:any) =>{

    }
    return <PopupFloatDiv 
    title="계정 추가"
    onBackgroundClicked={onBackgroundClicked}>
        <label onClick={()=>{setOAuth(false)}}><input type="radio" name="oauthCheck"/>일반 계정</label><label onClick={()=>{setOAuth(true)}}><input type="radio" name="oauthCheck"/>SNS 연동 로그인</label>
        {!isOAuth ? <form onSubmit={handleSubmit(onSubmitIdPassword)}>
            <AnimInputBox label="제목" inputType="text" name="accountName" hookFormRef={register}/>
            <AnimInputBox label="아이디" inputType="text" name="id" hookFormRef={register}/>
            <AnimInputBox label="비밀번호" inputType="text" name="pw" hookFormRef={register}/>
            <SubmitBtn>추가</SubmitBtn>
        </form> :
        <form onSubmit={handleSubmit(onSubmitOAuth)}>
        <AnimInputBox label="제목" inputType="text" name="accountName" hookFormRef={register}/>
        <SubmitBtn>추가</SubmitBtn>
        </form>
        }
    </PopupFloatDiv>
}

export default AddAccountPopup;