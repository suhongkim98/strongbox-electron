import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../modules';
import { addAccount } from '../modules/accountList';
import { StrongboxDatabase } from '../StrongboxDatabase';
import styled from '../styles/theme-components';
import AnimInputBox from './AnimInputBox';
import PopupFloatDiv from './PopupFloatDiv';
import Span from './Span';

interface AddAccountPopupProps{
    onBackgroundClicked:any;
}

const SubmitBtn = styled.button`
position:absolute;
bottom:35px;
left:50%;
transform:translateX(-50%);

width: 230px;
height: 40px;
background-color:white;
border-style:solid;
border-color:black;
border-width:1px;
border-radius:5px;
`;
const BodyWrapper = styled.div`
position:relative;
width:100%;
height:350px;

display:flex;
flex-direction:column;
align-items:center;
`;
const Form = styled.form`
width:100%;
height:calc(100% - 40px); //버튼높이빼기
padding: 20px 0 0 0;
`;
const Select = styled.select`
  width: 100%;
  height: 35px;
  background: white;
  color: gray;
  font-size: 14px;
  border: none;
  
  border-style:solid;
  border-color:black;
  border-width:1px;

  option {
    color: black;
    background: white;
    display: flex;
    white-space: pre;
    min-height: 20px;
    padding: 0px 2px 1px;
  }
`;
const SelectLabel = styled.div`
width:100%;
margin-bottom:15px;
display:flex;
flex-direction:column;
`;
interface AddAccountUseFormProps {
    accountName:string;
    id:string;
    pw:string;
}
const AddAccountPopup = ({onBackgroundClicked}:AddAccountPopupProps) =>{
    const selectedService = useSelector((state: RootState)=>state.selectedService.itemIndex);
    const serviceList = useSelector((state: RootState)=>state.serviceList.list);
    const accountList = useSelector((state: RootState)=>state.accountList.list);
    const { register, handleSubmit } = useForm<AddAccountUseFormProps>();
    const [isOAuth, setOAuth] = useState(false);
    const [dropboxSelectedService,setDropboxSelectedService] = useState(-1);
    const dispatch = useDispatch(); 


    const addAccountList =(item: any) =>{
        dispatch(addAccount(item));
    }
    const onSubmitIdPassword = (data:any) =>{
        const database = StrongboxDatabase.getInstance();
        database.addAccount(selectedService['idx'],data.accountName,{id:data.id,password:data.pw}).then((result:any)=>{
            addAccountList(
                {
                    ACCOUNT_IDX:result.ROWID,
                    ORDER: result.ACCOUNT_ORDER,
                    SERVICE_IDX:result.SERVICE_IDX,
                    ACCOUNT_NAME:result.NAME,
                    DATE:result.DATE,
                    OAUTH_LOGIN:result.OAuthIDX,ID:result.ID,
                    PASSWORD:result.PASSWORD
                });
        }).catch((error)=>{
            console.error(error);
        }); //id pw방식
        onBackgroundClicked(); // 창닫기
    }

    const onSubmitOAuth = (data:any) =>{
        const database = StrongboxDatabase.getInstance();
        database.addAccount(selectedService['idx'],data.accountName,{OAuthAccountIDX:data.accountSelect}).then((result:any)=>{
            addAccountList(
                {
                    ACCOUNT_IDX:result.ROWID,
                    ORDER: result.ORDER,
                    SERVICE_IDX:result.SERVICE_IDX,
                    ACCOUNT_NAME:result.NAME,
                    DATE:result.DATE,
                    OAUTH_LOGIN_IDX:result.OAuthIDX,
                    OAUTH_SERVICE_NAME:data.serviceSelect.split(",")[1],
                    ID:result.ID,PASSWORD:result.PASSWORD
                });
        }).catch((error)=>{
            console.error(error);
        }); // oauth방식
        onBackgroundClicked(); // 창닫기
    }
    return <PopupFloatDiv 
    title="계정 추가"
    onBackgroundClicked={onBackgroundClicked}>
        <BodyWrapper>
        <div><label onClick={()=>{setOAuth(false)}}><input type="radio" name="oauthCheck" defaultChecked={true}/><Span size="1.5rem">일반 계정</Span></label><label onClick={()=>{setOAuth(true)}}><input type="radio" name="oauthCheck"/><Span size="1.5rem">SNS 연동 로그인</Span></label></div>
        {!isOAuth ? <Form onSubmit={handleSubmit(onSubmitIdPassword)}>
            <AnimInputBox label="별명" inputType="text" name="accountName" hookFormRef={register}/>
            <AnimInputBox label="아이디" inputType="text" name="id" hookFormRef={register}/>
            <AnimInputBox label="비밀번호" inputType="text" name="pw" hookFormRef={register}/>
            <SubmitBtn><Span size="1.5rem" fontWeight="700">등록</Span></SubmitBtn>
        </Form> :
        <Form onSubmit={handleSubmit(onSubmitOAuth)}>
        <AnimInputBox label="별명" inputType="text" name="accountName" hookFormRef={register}/>
        <SelectLabel>
            <Span size="1.5rem">서비스 선택</Span>
            <Select name="serviceSelect" ref={register({required: true})} onChange={(e:any)=>{setDropboxSelectedService(e.target.value.split(",")[0])}}>
                {serviceList.map((data:any)=>{return <option value={data.SERVICE_IDX + "," + data.SERVICE_NAME} key={data.SERVICE_IDX}>{data.SERVICE_NAME}</option>})}
            </Select>
        </SelectLabel>
        <SelectLabel>
            <Span size="1.5rem">계정 선택</Span>
            <Select name="accountSelect" ref={register({required: true})}>
                {dropboxSelectedService > 0 && accountList.map((data:any)=>{
                    if(data.SERVICE_IDX !== Number(dropboxSelectedService)) return null;
                    if(data.OAUTH_LOGIN_IDX) return null; // OAUTH계정은 선택 못하도록
                    return <option value={data.ACCOUNT_IDX} key={data.ACCOUNT_IDX}>{data.ACCOUNT_NAME}</option>
                })}
            </Select>
        </SelectLabel>
        <SubmitBtn><Span size="1.5rem" fontWeight="700">등록</Span></SubmitBtn>
        </Form>
        }
        </BodyWrapper>
    </PopupFloatDiv>
}

export default AddAccountPopup;