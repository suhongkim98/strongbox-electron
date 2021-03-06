import React from 'react';
import { useState } from "react";
import { ContextMenu, ContextMenuTrigger, MenuItem } from "react-contextmenu";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../modules";
import { updateSelectedItemIndex } from "../modules/selectedService";
import { updateServiceAsync } from '../modules/serviceList';
import { StrongboxDatabase } from "../StrongboxDatabase";
import EditServicePopup from './EditServicePopup';
import PopupWarning from "./PopupWarning";
import Span from "./Span";

interface GroupFolderItemProps{
    serviceIDX:number;
    serviceName:string;
}

const GroupFolderItemWrapper = styled.div`
margin-bottom:5px;
:hover{
    Span{
        color:aqua;
    }
}
`;
const GroupFolderItem = ({serviceIDX,serviceName}:GroupFolderItemProps) =>{
    const [deleteServicePopup, setDeleteServicePopup] = useState(false);
    const [editServicePopupIdx, setEditServicePopupIdx] = useState(-1);
    const dispatch = useDispatch(); 
    const CONTEXT_ID = "GroupFolderItemContext" + serviceIDX;
    const selectedService = useSelector((state: RootState)=>state.selectedService.itemIndex);

    const updateSelectedItem = (newItem: any) =>{
        dispatch(updateSelectedItemIndex(newItem));
    }

    const onClickMenu = (e:any, data:any) =>{
        switch(data.action){
            case 'deleteService':
                setDeleteServicePopup(true);
                break;
            case 'editService':
                setEditServicePopupIdx(data.idx);
                break;    
            default:
                break;
        }
    }

    const deleteServiceByIDX = () =>{
        //만약 삭제하고자 하는 서비스가 선택 중인 서비스라면 selectedService 초기화
        if(selectedService.idx === serviceIDX) updateSelectedItem({idx:-1,name:"no-name"});

        //DB 및 service리스트에서 삭제
        const database = StrongboxDatabase.getInstance();
        database.deleteService(serviceIDX)
        .then(()=>{
            dispatch(updateServiceAsync());
        })
        .catch((error)=>{console.log(error)});
    }

    return <div>
    {
        deleteServicePopup === true && <PopupWarning message="정말 해당 서비스를 삭제하시겠습니까?" onAgree={deleteServiceByIDX} onDeny={()=>{setDeleteServicePopup(false)}} onBackgroundClicked={()=>{setDeleteServicePopup(false)}} />
    }
    {
        editServicePopupIdx !== -1 && <EditServicePopup onBackgroundClicked={() => setEditServicePopupIdx(-1)} serviceIdx={editServicePopupIdx} />
    }
    <ContextMenu id={CONTEXT_ID}>
        <MenuItem onClick={onClickMenu} data={{ action: 'editService', idx: serviceIDX }}>'{serviceName}' 서비스 편집</MenuItem>
        <MenuItem divider />
        <MenuItem onClick={onClickMenu} data={{ action: 'deleteService', idx: serviceIDX }}>'{serviceName}' 서비스 삭제</MenuItem>
    </ContextMenu>
    <ContextMenuTrigger id={CONTEXT_ID}>
        <GroupFolderItemWrapper onClick={() => { updateSelectedItem({idx:serviceIDX,name:serviceName})}} >
            <Span textColor="white" size="1.6rem">{serviceName}</Span>
        </GroupFolderItemWrapper>
    </ContextMenuTrigger>
</div>
}

export default GroupFolderItem;