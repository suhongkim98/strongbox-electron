import React from 'react';
import { useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import { updateGroupAsync } from '../modules/groupList';
import { StrongboxDatabase } from '../StrongboxDatabase';
import AnimInputBox from './AnimInputBox';
import PopupFloatDiv from './PopupFloatDiv';

interface AddFolderPopupProps{
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
const TotalWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;
    width:100%;
    height:100%;
`;
const AddFolderPopup = ({onBackgroundClicked}:AddFolderPopupProps) =>{
    const dispatch = useDispatch(); // groupList redux에 상태변화를 주기 위해

    const onButtonClicked = (event:any) =>{
        event.preventDefault();
        const folderName = event.target.folderName.value;
        //클릭 시 DB에 데이터 집어넣고
        const database = StrongboxDatabase.getInstance();
        database.isExistGroupName(folderName).then((result) => {
            if(result > 0) {
                toast.error('이미 그룹이 존재합니다.', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
            } else {
                database.addGroup(global.idx,folderName).then((result)=>{
                    if(result){
                    //데이터 넣기 성공 시
                    //redux 이용해 mainPage 폴더리스트 리렌더링
                    dispatch(updateGroupAsync());
                    onBackgroundClicked(); // 창닫기
                    }else{
                        //실패 시
                        console.log("폴더추가 실패");
                    }
                }).catch((error)=>{
                    console.log(error);
                });
            }
        }).catch((error) =>{
            console.error(error+ "ㅁ");
        });
        
    }
    return (<TotalWrapper>
        <ToastContainer />
        <PopupFloatDiv 
    title="폴더 추가"
    onBackgroundClicked={onBackgroundClicked}>
        <form onSubmit={onButtonClicked}><AnimInputBox label="이름" inputType="text" name="folderName"/>
        <FooterWrapper><Button>추가</Button></FooterWrapper>
        </form>
    </PopupFloatDiv></TotalWrapper>);
}

export default AddFolderPopup;