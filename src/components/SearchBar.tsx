import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import AnimationLoading from '../images/AnimationLoading';
import SearchSVG from '../images/SearchSVG';

interface SearchBarProps{
width:string;
height:string;
source:any;
filterFunc:any;
resultPrintFunc:any;
}
interface InputProps{
    width:string;
    height:string;
    }
const TotalWrapper = styled.div`
display:flex;
align-items:center;
position:relative;

background-color:white;
border-style:solid;
border-color:gray;
border-width:1px;
border-radius:5px;
padding: 0 10px 0 0;


`;
const InputBox = styled.input<InputProps>`
width: ${props=>props.width};
height: ${props=>props.height};

font-size: 1.5rem;
padding: 0 0 0 10px;
:focus~svg path{//focus 시마다 아이콘 색이 바뀌도록
    fill:black;
}
`;

const SearchResultBox = styled.div`
width:100%;
position: absolute;
left:0px;
top:45px; //인풋박스 크기
overflow: hidden;

background-color: white;
border-style:solid;
border-color:black;
border-width:1px;
border-radius:5px;
`;
const SearchResultBoxInner = styled.div`

`;

const SearchBar = ({width,height,source,filterFunc,resultPrintFunc}:SearchBarProps) =>{
    const [isLoading,setLoading] = useState(false);
    const [isFocus,setFocus] = useState(false);
    const [result,setResult] = useState([]);
    const loadingTimerID = useRef<number>(-1);
    const inputValue = useRef<string>('');
    
    const resultBoxRef = useRef<HTMLDivElement>(null);
    const resultBoxListRef = useRef<HTMLDivElement>(null);
    

    const onChangeInput = (event:any) => {
        setLoading(true);
        updateBodyHeight(0);
        if(loadingTimerID.current !== -1){
            clearTimeout(loadingTimerID.current);
            loadingTimerID.current = -1;
        }
        inputValue.current = event.target.value;
        loadingTimerID.current = setTimeout(onLoadingFinish,500);
    }
    const updateBodyHeight = (height: any) =>{
        if(resultBoxRef.current) {
            //리스트 길이 계산해서 바디 길이 설정
            resultBoxRef.current.style.height = height+"px";
        }
    }
    const onLoadingFinish = () =>{
        setLoading(false);
        if(inputValue.current !== '') { // 공백이 아닐 때만
            setResult(source.filter((element:any)=>{return filterFunc(element, inputValue.current)})); //소스에서 검색 결과를 거르는 역할을 하는 필터를 부모에서 정해주자 
            updateBodyHeight(resultBoxListRef.current?.offsetHeight);//출력 후 높이 조절
        }
    }

    return <TotalWrapper>
        {isFocus && <SearchResultBox ref={resultBoxRef}><SearchResultBoxInner ref={resultBoxListRef}>
            {result.map((element:any)=>{return resultPrintFunc(element)}) /*거른 결과를 어떻게 보여줄지 부모에서 정하자 */}
            </SearchResultBoxInner></SearchResultBox>}
        <InputBox type="text" placeholder="검색.." width={width} height={height} onChange={onChangeInput} onFocus={()=>{setFocus(true)}} onBlur={()=>{setFocus(false)}} />
        {isLoading ? <AnimationLoading width="20px" height="20px"/> : <SearchSVG width="20px" height="20px" color="gray"/>}
        </TotalWrapper>
}

export default SearchBar;