import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import MinusSVG from '../images/MinusSVG';
import PlusSVG from '../images/PlusSVG';
import { StrongboxDatabase } from '../StrongboxDatabase';
import Span from './Span';

interface GroupFolderProps{
    groupIdx:number;
    groupName:string;
}
const TotalWrapper = styled.div`
width:100%;

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
    const [services, setServices] = useState([]);
    const bodyRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        //그룹idx 받으면 그거로 서비스목록,이름 뽑아 출력
        const database = StrongboxDatabase.getInstance();
        database.getServiceList(groupIdx).then((result)=>{
            if(result.length > 0) { // 서비스 목록이 있을 때만 리스트 업데이트
                setServices(result.map((data:any)=>{return <ServiceItem key={data.IDX}><Span textColor="black" size="2rem">{data.SERVICE_NAME}</Span></ServiceItem> }));
                show();
            }
        }).catch((error)=>{
            console.log(error);
        });
    },[]);

    const onClickToggleBtn = () =>{
        if(toggle) hide();
        else show();
    }
    const show = () =>{
        setToggle(true);
        if(bodyRef.current) {
            //리스트 길이 계산해서 바디 길이 설정
            bodyRef.current.style.height = listRef.current?.offsetHeight+"px";
        }
    }
    const hide = () =>{
        setToggle(false);
        if(bodyRef.current) {
            bodyRef.current.style.height = "0px";
        }
    }
    return <TotalWrapper>
        <HeaderWrapper>
            <HeaderInnerWrapper><Span size="2rem" textColor="gray">{groupName}</Span></HeaderInnerWrapper>
            <HeaderInnerWrapper onClick={onClickToggleBtn}>
                {
                    toggle ? <MinusSVG width="20px" height="20px" color="white" /> : <PlusSVG width="20px" height="20px" color="white" />
                }
            </HeaderInnerWrapper>
        </HeaderWrapper>
        <BodyWrapper ref={bodyRef}>
            <ServiceList ref={listRef}>
            {services}
            </ServiceList>
        </BodyWrapper>
    </TotalWrapper>
}

export default GroupFolder;