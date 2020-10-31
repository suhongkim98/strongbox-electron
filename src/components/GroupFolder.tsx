import React, { useEffect, useRef, useState } from 'react';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import MinusSVG from '../images/MinusSVG';
import PlusSVG from '../images/PlusSVG';
import { RootState } from '../modules';
import AddServcePopup from './AddServicePopup';
import Span from './Span';

import '../styles/css/react-contextmenu.css'; //contextmenu 사용 시 추가해야함
import '../styles/css/custom.css'; // 

interface GroupFolderProps{
    groupIdx:number;
    groupName:string;
}
const TotalWrapper = styled.div`
width:100%;
margin-bottom:5px;

border-style: solid;
border-width: 1px;
border-color: gray;
border-collapse: hidden;
`;
const HeaderWrapper =styled.div`
height:40px;
display:flex;
justify-content:space-between;
align-items:center;
background-color: #1A1A2E;
`;
const HeaderInnerWrapper = styled.div`
margin-left:5px;
margin-right:5px;
`;
const BodyWrapper =styled.div`
height:0;
background-color: #E6E6EB;

transition: height 0.3s ease;
overflow: hidden;
`;
const ServiceList = styled.div`
width:100%;
padding: 5px 10px 10px 5px;
`;
const ServiceItem = styled.div`
margin-bottom:5px;
`;
const GroupFolder = ({groupIdx,groupName}:GroupFolderProps) =>{
    const [toggle,setToggle] = useState(false); // true면 폴더 연 상태 false면 닫은 상태
    const bodyRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const serviceList = useSelector((state: RootState) => state.serviceList.list);
    
    const CONTEXT_ID = "context" + groupIdx; // 마우스 우클릭 통일아이디
    const [addServicePopup,setAddServicePopup] = useState(false);

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
                setAddServicePopup(true);
                break;
            case 'editFolder':
                break;
            default:
                break;
        }
    }

    return <TotalWrapper>
        {
            addServicePopup && <AddServcePopup onBackgroundClicked={()=>{setAddServicePopup(false)}} />
        }
        <ContextMenu id={CONTEXT_ID}>
            <MenuItem onClick={onClickMenu} data={{ action: 'addAccount' }}>{groupName} 폴더에 계정 추가</MenuItem>
            <MenuItem divider />
            <MenuItem onClick={onClickMenu} data={{ action: 'editFolder' }}>편집</MenuItem>
        </ContextMenu>
            <ContextMenuTrigger id={CONTEXT_ID}>
        <HeaderWrapper>
            <HeaderInnerWrapper><Span size="2rem" textColor="gray">{groupName}</Span></HeaderInnerWrapper>
            <HeaderInnerWrapper onClick={onClickToggleBtn}>
                {
                    toggle ? <MinusSVG width="20px" height="20px" color="white" /> : <PlusSVG width="20px" height="20px" color="white" />
                }
            </HeaderInnerWrapper>
        </HeaderWrapper>
            </ContextMenuTrigger>
        <BodyWrapper ref={bodyRef}>
            <ServiceList ref={listRef}>
            {serviceList.map((data:any)=>
            {
                if(data.GRP_IDX !== groupIdx) return null;
                return <ServiceItem key={data.SERVICE_IDX}><Span textColor="black" size="2rem">{data.SERVICE_NAME}</Span></ServiceItem>
            }
        )}
            </ServiceList>
        </BodyWrapper>
    </TotalWrapper>
}

export default GroupFolder;