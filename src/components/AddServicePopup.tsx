import React, { useEffect, useState } from 'react';
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
const Select = styled.select`
  width: 100%;
  height: 35px;
  background: white;
  color: gray;
  font-size: 14px;
  border: none;

  option {
    color: black;
    background: white;
    display: flex;
    white-space: pre;
    min-height: 20px;
    padding: 0px 2px 1px;
  }
`;
interface AddServiceUseFormProps{
    serviceInputBox:string;
    groupSelect:string;
}
const AddServcePopup = ({onBackgroundClicked}:AddServcePopupProps) =>{
    const [groupList, setGroupList] = useState([]);
    const { register, errors, handleSubmit,setError } = useForm<AddServiceUseFormProps>();
    const dispatch = useDispatch(); 

    useEffect(()=>{
        const database = StrongboxDatabase.getInstance();
        database.getGroupList(global.idx).then((result)=>{
            setGroupList(result.map((data:any)=>{
                return <option value={data.IDX} key={data.IDX}>{data.GRP_NAME}</option>
            }));
        }).catch((error)=>{
            console.log(error);
        });
    },[]);

    const addServiceList = (item: any) =>{
        dispatch(addService(item));
    }

    const onButtonClicked = (data:any) =>{
        const groupIDX = data.groupSelect;
        const serviceName = data.serviceInputBox;
        console.log(groupIDX);
        console.log(serviceName);
        if(groupIDX === null || groupIDX === ""){
            //그룹선택 안 한 경우
            setError("groupSelect",{
                type: "nullIDX",
                message: "폴더를 선택해주세요!"
            });
        }else{
            //서비스 등록 후 그룹리덕스 건들기
            const database = StrongboxDatabase.getInstance();
            database.addService(Number(groupIDX),serviceName).then((result)=>{
                if(result){
                    addServiceList({GRP_IDX: Number(groupIDX), SERVICE_IDX: result[0], SERVICE_NAME: result[1]});
                    onBackgroundClicked();
                }else{
                    //실패 시
                    console.log("서비스추가 실패");
                }
            }).catch((error)=>{
                console.log(error);
            });
        }
    }
    return <PopupFloatDiv 
    title="폴더에 계정 추가"
    onBackgroundClicked={onBackgroundClicked}>
        <form onSubmit={handleSubmit(onButtonClicked)}>
            <AnimInputBox label="계정 이름" inputType="text" name="serviceInputBox" hookFormRef={register({required: true, maxLength: 10})}/>
            <Select name="groupSelect" ref={register({required: true})}>
            <option value="" hidden>
            폴더 선택
            </option>
            {groupList}
            </Select>
            {errors.groupSelect?.type === "required" && <Span size="1.5rem" textColor="red" fontWeight={600}>그룹을 선택해주세요</Span>}
            {errors.groupSelect?.type === "nullIDX" && <Span size="1.5rem" textColor="red" fontWeight={600}>{errors.groupSelect.message}</Span>}
            {errors.serviceInputBox?.type === "required" && <Span size="1.5rem" textColor="red" fontWeight={600}>이름을 입력해주세요</Span>}
            {errors.serviceInputBox?.type === "maxLength" && <Span size="1.5rem" textColor="red" fontWeight={600}>10글자 이내로 작성해주세요</Span>}
            <FooterWrapper><Button>저장</Button></FooterWrapper>
        </form>
    </PopupFloatDiv>    
}

export default AddServcePopup;