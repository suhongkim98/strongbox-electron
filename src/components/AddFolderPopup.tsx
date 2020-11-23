import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { addGroup } from '../modules/groupList';
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

const AddFolderPopup = ({onBackgroundClicked}:AddFolderPopupProps) =>{
    const dispatch = useDispatch(); // groupList redux에 상태변화를 주기 위해
    
    const addGroupList = (item: any) =>{
        //updateGroupList함수를 실행하면 dispatch를 호출해서 redux 상태변화를 일으킴
        dispatch(addGroup(item));
    }

    const onButtonClicked = (event:any) =>{
        event.preventDefault();
        const folderName = event.target.folderName.value;
        //클릭 시 DB에 데이터 집어넣고
        const database = StrongboxDatabase.getInstance();
        database.addGroup(global.idx,folderName).then((result)=>{
            if(result){
            //데이터 넣기 성공 시
            //redux 이용해 mainPage 폴더리스트 리렌더링
            console.log(result);
            addGroupList({GRP_IDX: Number(result[0]), GRP_NAME: String(result[1])});
            }else{
                //실패 시
                console.log("폴더추가 실패");
            }
        }).catch((error)=>{
            console.log(error);
        });

        onBackgroundClicked(); // 창닫기
    }
    return <PopupFloatDiv 
    title="폴더 추가"
    onBackgroundClicked={onBackgroundClicked}>
        <form onSubmit={onButtonClicked}><AnimInputBox label="이름" inputType="text" name="folderName"/>
        <FooterWrapper><Button>추가</Button></FooterWrapper>
        </form>
    </PopupFloatDiv>
}

export default AddFolderPopup;