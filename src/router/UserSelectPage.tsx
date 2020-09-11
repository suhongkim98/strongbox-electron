import React from 'react';
import styled from 'styled-components';
import UserSelect from '../components/UserSelect';


const TotalWrapper = styled.div`
width:100%;
height:100%;

display:flex;
flex-direction:column;
justify-content:center;
align-items:center;

`;

const SpanWrapper = styled.div `
margin-bottom:50px;
`;

const UserSelectWrapper = styled.div `
width:400px;
height:150px;
margin-bottom:40px;

border-style:solid;
border-color:grey;
border-width:1px;
`;
const Scroll = styled.div`
width:100%;
height:100%;
overflow: auto;
::-webkit-scrollbar{
    width:10px;
}
::-webkit-scrollbar-thumb {
  background: #888; 
}
::-webkit-scrollbar-thumb:hover {
  background: #555; 
}

`;
interface SpanProps {
    textColor?:any;
    size?:any;
    fontWeight?:any;
}
const Span = styled.span<SpanProps>`
${({textColor}) => 
//텍스트 컬러가 있다면
    textColor &&
    `color:${textColor};`
}
${({size}) => 
    size &&
    `font-size:${size};`
}
${({fontWeight}) => 
    fontWeight &&
    `font-weight:${fontWeight};`
}
`;
const UserSelectPage:React.FC = () =>{

    return <TotalWrapper>
        <SpanWrapper><Span textColor="white" size="4rem" fontWeight="700">사용자 선택</Span></SpanWrapper>
        <UserSelectWrapper><Scroll><UserSelect/></Scroll></UserSelectWrapper>
        <SpanWrapper><Span textColor="white" size="1.5rem">사용자 추가</Span></SpanWrapper>
        <SpanWrapper><Span textColor="white" size="1.5rem">로그인 상태 유지</Span></SpanWrapper>
    </TotalWrapper>;
}

export default UserSelectPage;