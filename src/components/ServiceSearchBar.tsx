import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import FolderSVG from '../images/FolderSVG';
import { updateSelectedItemIndex } from '../modules/selectedService';
import SearchBar from './SearchBar';
import Span from './Span';

interface ServiceSearchBarProps{
    width:string;
    height:string;
    source:any;
}

const ResultElement = styled.div`
width:100%;
height:45px;
display:flex;
align-items:center;
padding: 0 0 0 14px;

border-style:solid;
border-bottom-width:1px;
border-color:gray;
`;

const FolderName = styled.div`
display:flex;
align-items:center;
:after{
    font-weight:700;
    content:"|";
    display:block;
    padding: 0 5px 0 5px;
}
`;

const ServiceSearchBar = ({width,height,source}:ServiceSearchBarProps) =>{
    const dispatch = useDispatch(); 

    const ServiceSearchFilter = (element:any, inputValue:string) =>{
        //source를 어떻게 필터링할건지
        return element.SERVICE_NAME.indexOf(inputValue) > -1; //서비스 이름이 검색이 된다면 true, 안되면 false
    }
    const updateSelectedItem = (newItem: any) =>{
        dispatch(updateSelectedItemIndex(newItem));
    }
    const onClickService = (serviceIDX:number,serviceName:string) =>{
        updateSelectedItem({idx:serviceIDX,name:serviceName});
    }
    const ServiceSearchResultFunc = (element:any) =>{ 
        // 필터링결과물을 어떻게 보여줄건지
        return <ResultElement key={element.SERVICE_IDX} onMouseDown={()=>{onClickService(element.SERVICE_IDX,element.SERVICE_NAME)}}>
            <FolderSVG width="20px" height="20px"/><FolderName>
            <Span fontWeight="700" size="1.4rem">{element.GRP_NAME}</Span>
            </FolderName><Span size="1.4rem">{element.SERVICE_NAME}</Span></ResultElement>
    }
    return <SearchBar width={width} height={height} source={source} filterFunc={ServiceSearchFilter} resultPrintFunc={ServiceSearchResultFunc}/>
}

export default ServiceSearchBar;