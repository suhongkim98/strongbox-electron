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

`;

const UserSelectWrapper = styled.div `
width:400px;
height:150px;
background-color:white;
border-radius:10px;
`;

interface SpanProps {
    textColor?:any;
    size?:any;
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
`;
const UserSelectPage:React.FC = () =>{

    return <TotalWrapper>
        <SpanWrapper><Span textColor="white" size="4rem">사용자 선택</Span></SpanWrapper>
        <UserSelectWrapper><UserSelect/></UserSelectWrapper>
        <SpanWrapper><Span textColor="white" size="1.5rem">사용자 추가</Span></SpanWrapper>
        <SpanWrapper><Span textColor="white" size="1.5rem">로그인 상태 유지</Span></SpanWrapper>
    </TotalWrapper>;
}

export default UserSelectPage;