import React from 'react';
import styled from 'styled-components';
import { StrongboxDatabase } from '../StrongboxDatabase';
import AnimInputBox from './AnimInputBox';
import PopupFloatDiv from './PopupFloatDiv';
import { useForm } from "react-hook-form";
import Span from './Span';
import { useDispatch } from 'react-redux';
import { updateServiceAsync } from '../modules/serviceList';
import { toast, ToastContainer } from 'react-toastify';

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

const TotalWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;
    width:100%;
    height:100%;
`;
interface AddServiceUseFormProps{
    serviceInputBox:string;
    groupSelect:string;
}
const AddServcePopup = ({onBackgroundClicked,groupIdx}:AddServcePopupProps) =>{
    const { register, errors, handleSubmit } = useForm<AddServiceUseFormProps>();
    const dispatch = useDispatch(); 

    const onButtonClicked = (data:any) =>{
        const serviceName = data.serviceInputBox;
        console.log(serviceName);
        const database = StrongboxDatabase.getInstance();
        database.isExistServiceName(serviceName, groupIdx).then((result) => {
            if(result) {
                toast.error('이미 해당 서비스가 존재합니다.', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
            } else {
                database.addService(groupIdx,serviceName).then((result)=>{
                    if(result){
                        dispatch(updateServiceAsync());
                        onBackgroundClicked();
                    }else{
                        //실패 시
                        console.log("서비스추가 실패");
                        toast.error('서비스 추가하는데 문제가 있습니다.', {
                            position: "bottom-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            });
                    }
                }).catch((error)=>{
                    console.log(error);
                });
            }
        }).catch((error) => {
            console.error(error);
        });
        
    }
    return (<TotalWrapper>
        <ToastContainer />
        <PopupFloatDiv 
    title="폴더에 계정 추가"
    onBackgroundClicked={onBackgroundClicked}>
        <form onSubmit={handleSubmit(onButtonClicked)}>
            <AnimInputBox label="계정 이름" inputType="text" name="serviceInputBox" hookFormRef={register({required: true, maxLength: 10})}/>
            {errors.serviceInputBox?.type === "required" && <Span size="1.5rem" textColor="red" fontWeight={600}>이름을 입력해주세요</Span>}
            {errors.serviceInputBox?.type === "maxLength" && <Span size="1.5rem" textColor="red" fontWeight={600}>10글자 이내로 작성해주세요</Span>}
            <FooterWrapper><Button>저장</Button></FooterWrapper>
        </form>
    </PopupFloatDiv>    
    </TotalWrapper>);
}

export default AddServcePopup;