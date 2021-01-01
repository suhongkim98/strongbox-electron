import React from 'react';
import styled from 'styled-components';
import { StrongboxDatabase } from '../StrongboxDatabase';
import AnimInputBox from './AnimInputBox';
import PopupFloatDiv from './PopupFloatDiv';
import { useForm } from "react-hook-form";
import Span from './Span';
import { useDispatch } from 'react-redux';
import { addService } from '../modules/serviceList';

interface AddServcePopupProps{
    onBackgroundClicked:any;
    groupIdx:number;
}
const FooterWrapper = styled.div`
display:flex;
justify-content:center;
align-items:center;
`;

const Button = styled.button`
width:190px;
height:40px;
background-color:white;
color:black;
margin-top:10px;
cursor:pointer;

border-style:solid;
border-width:1px;
border-color:black;
border-radius:5px;
`;

interface AddServiceUseFormProps{
    serviceInputBox:string;
    groupSelect:string;
}
const AddServcePopup = ({onBackgroundClicked,groupIdx}:AddServcePopupProps) =>{
    const { register, errors, handleSubmit } = useForm<AddServiceUseFormProps>();
    const dispatch = useDispatch(); 

    const addServiceList = (item: any) =>{
        dispatch(addService(item));
    }

    const onButtonClicked = (data:any) =>{
        const serviceName = data.serviceInputBox;
        console.log(serviceName);
        const database = StrongboxDatabase.getInstance();
        database.addService(groupIdx,serviceName).then((result)=>{
            if(result){
                addServiceList(
                    {
                        GRP_IDX: groupIdx, 
                        SERVICE_IDX: result.rowid, 
                        SERVICE_NAME: result.serviceName,
                        ORDER: result.ORDER
                    });
                onBackgroundClicked();
            }else{
                //실패 시
                console.log("서비스추가 실패");
            }
        }).catch((error)=>{
            console.log(error);
        });
    }
    return <PopupFloatDiv 
    title="폴더에 계정 추가"
    onBackgroundClicked={onBackgroundClicked}>
        <form onSubmit={handleSubmit(onButtonClicked)}>
            <AnimInputBox label="계정 이름" inputType="text" name="serviceInputBox" hookFormRef={register({required: true, maxLength: 10})}/>
            {errors.serviceInputBox?.type === "required" && <Span size="1.5rem" textColor="red" fontWeight={600}>이름을 입력해주세요</Span>}
            {errors.serviceInputBox?.type === "maxLength" && <Span size="1.5rem" textColor="red" fontWeight={600}>10글자 이내로 작성해주세요</Span>}
            <FooterWrapper><Button>저장</Button></FooterWrapper>
        </form>
    </PopupFloatDiv>    
}

export default AddServcePopup;