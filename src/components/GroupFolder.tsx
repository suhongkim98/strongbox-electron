import React, { useEffect, useRef, useState } from 'react';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import MinusSVG from '../images/MinusSVG';
import PlusSVG from '../images/PlusSVG';
import { RootState } from '../modules';
import AddServcePopup from './AddServicePopup';
import Span from './Span';
import { updateSelectedItemIndex } from '../modules/selectedService';
import {updateAccount} from '../modules/accountList';
import { deleteGroup } from '../modules/groupList';

import '../styles/css/react-contextmenu.css'; //contextmenu 사용 시 추가해야함
import '../styles/css/custom.css'; // 
import { StrongboxDatabase } from '../StrongboxDatabase';
import PopupWarning from './PopupWarning';
import { deleteService } from '../modules/serviceList';

interface GroupFolderProps{
    groupIdx:number;
    groupName:string;
}
const TotalWrapper = styled.div`
width:100%;
margin-bottom:5px;
`;
const HeaderInnerWrapper = styled.div`
margin-left:10px;
margin-right:10px;
`;
const HeaderWrapper =styled.div`
height:40px;
display:flex;
justify-content:space-between;
align-items:center;

`;
const BodyWrapper =styled.div`
height:0;

transition: height 0.3s ease;
overflow: hidden;
`;
const ServiceList = styled.div`
width:100%;
padding: 0 10px 5px 25px;
`;
const ServiceItemWrapper = styled.div`
margin-bottom:5px;
:hover{
    Span{
        color:aqua;
    }
}
`;
const GroupFolder = ({groupIdx,groupName}:GroupFolderProps) =>{
    const [toggle,setToggle] = useState(false); // true면 폴더 연 상태 false면 닫은 상태
    const bodyRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const serviceList = useSelector((state: RootState) => state.serviceList.list);
    
    const CONTEXT_ID = "context" + groupIdx; // 마우스 우클릭 통일아이디
    const [addServicePopupIDX,setAddServicePopupIDX] = useState(-1);
    const [deleteGroupPopup, setDeleteGroupPopup] = useState(false);

    const dispatch = useDispatch(); 
    useEffect(()=>{
        if(Number(listRef.current?.childElementCount) > 0){
            console.log(Number(listRef.current?.childElementCount));
            show();
        }
    },[]);

    useEffect(()=>{
        if(toggle){
            updateBodyHeight(listRef.current?.offsetHeight);
        }
    });

    const onClickToggleBtn = () =>{
        if(toggle) hide();
        else show();
    }
    const updateBodyHeight = (height: any) =>{
        if(bodyRef.current) {
            //리스트 길이 계산해서 바디 길이 설정
            bodyRef.current.style.height = height+"px";
        }
    }

    const show = () =>{
        setToggle(true);
        updateBodyHeight(listRef.current?.offsetHeight);
    }

    const hide = () =>{
        setToggle(false);
        updateBodyHeight(0);
    }

    const onClickMenu = (e:any, data:any) =>{
        switch(data.action){
            case 'addAccount':
                setAddServicePopupIDX(data.idx);
                break;
            case 'editFolder':
                break;
            case 'deleteGroup':
                setDeleteGroupPopup(true);
                break;
            default:
                break;
        }
    }

    const deleteGroupByIDX = () =>{
        const database = StrongboxDatabase.getInstance();
        if(database.deleteGroup(groupIdx) === true){
            //삭제 성공하면 redux 상태변화
            dispatch(deleteGroup(groupIdx));
        }
        
    }

    return <TotalWrapper>
        {
            addServicePopupIDX >= 0 && <AddServcePopup groupIdx={addServicePopupIDX} onBackgroundClicked={()=>{setAddServicePopupIDX(-1)}} />
        }
        {
            deleteGroupPopup === true && <PopupWarning message="정말 폴더를 삭제하시겠습니까?" onAgree={deleteGroupByIDX} onDeny={()=>{setDeleteGroupPopup(false)}} onBackgroundClicked={()=>{setDeleteGroupPopup(false)}} />
        }
        <ContextMenu id={CONTEXT_ID}>
            <MenuItem onClick={onClickMenu} data={{ action: 'deleteGroup', idx: groupIdx }}>'{groupName}' 폴더 삭제</MenuItem>
            <MenuItem divider />
            <MenuItem onClick={onClickMenu} data={{ action: 'addAccount', idx: groupIdx }}>'{groupName}' 폴더에 계정 추가</MenuItem>
            <MenuItem onClick={onClickMenu} data={{ action: 'editFolder' }}>편집</MenuItem>
        </ContextMenu>
            <ContextMenuTrigger id={CONTEXT_ID}>
        <HeaderWrapper>
            <HeaderInnerWrapper><Span size="2rem" textColor="gray">{groupName}</Span></HeaderInnerWrapper>
            <HeaderInnerWrapper onClick={onClickToggleBtn}>
                {
                    toggle ? <MinusSVG width="20px" height="20px" color="gray" /> : <PlusSVG width="20px" height="20px" color="gray" />
                }
            </HeaderInnerWrapper>
        </HeaderWrapper>
            </ContextMenuTrigger>
        <BodyWrapper ref={bodyRef}>
            <ServiceList ref={listRef}>
            {serviceList.map((data:any)=>
            {
                if(data.GRP_IDX !== groupIdx) return null;
                return <ServiceItem key={data.SERVICE_IDX} serviceIDX={data.SERVICE_IDX} serviceName={data.SERVICE_NAME}/>
            }
        )}
            </ServiceList>
        </BodyWrapper>
    </TotalWrapper>
}

interface ServiceItemProps{
    serviceIDX:number;
    serviceName:string;
}
const ServiceItem = ({serviceIDX,serviceName}:ServiceItemProps) =>{
    const dispatch = useDispatch(); 
    const CONTEXT_ID = "serviceItemContext" + serviceIDX;
    const selectedService = useSelector((state: RootState)=>state.selectedService.itemIndex);
    const accountList = useSelector((state: RootState)=>state.accountList.list);

    const updateSelectedItem = (newItem: any) =>{
        dispatch(updateSelectedItemIndex(newItem));
    }
    const updateAccountList = (newList: any) =>{
        dispatch(updateAccount(newList));
    }
    const deleteServiceList = (item: any) =>{
        dispatch(deleteService(item));
    }

    const onClickMenu = (e:any, data:any) =>{
        switch(data.action){
            case 'deleteService':
                //만약 삭제하고자 하는 서비스가 선택 중인 서비스라면 selectedService 초기화
                if(selectedService.idx === serviceIDX) updateSelectedItem({idx:-1,name:"no-name"});

                //삭제하고자 하는 서비스idx에 해당하는 accountList redux 삭제 // filter로 거른 후 update
                updateAccountList(accountList.filter((row:any)=>{return row.SERVICE_IDX !== serviceIDX}));

                //DB 및 service리스트에서 삭제
                const database = StrongboxDatabase.getInstance();
                database.deleteService(serviceIDX);
                deleteServiceList(serviceIDX);
                break;
            default:
                break;
        }
    }

    return <div>
        <ContextMenu id={CONTEXT_ID}>
            <MenuItem onClick={onClickMenu} data={{ action: 'deleteService', idx: serviceIDX }}>'{serviceName}' 계정 삭제</MenuItem>
        </ContextMenu>
        <ContextMenuTrigger id={CONTEXT_ID}>
            <ServiceItemWrapper onClick={() => { updateSelectedItem({idx:serviceIDX,name:serviceName})}} >
                <Span textColor="white" size="2rem">{serviceName}</Span>
            </ServiceItemWrapper>
        </ContextMenuTrigger>
    </div>
}

export default GroupFolder;