import React from 'react';
import styled from 'styled-components';
import { StrongboxDatabase } from '../StrongboxDatabase';


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
    // ///////////////DB TEST///////////////////
    // const database = StrongboxDatabase.getInstance();
    // database.testCreateTable();
    // database.testInsert();
    // //받아오는 예시
    // database.testSelect().then((result)=>{
    //     console.log(result);
    // }).catch((error)=>{
    //     console.log(error);
    // });
    // /////////////////////////////////////

    return <TotalWrapper>
        <SpanWrapper><Span textColor="white" size="4rem">사용자 선택</Span></SpanWrapper>
        <UserSelectWrapper></UserSelectWrapper>
        <SpanWrapper><Span textColor="white" size="1.5rem">사용자 추가</Span></SpanWrapper>
        <SpanWrapper><Span textColor="white" size="1.5rem">로그인 상태 유지</Span></SpanWrapper>
    </TotalWrapper>;
}

export default UserSelectPage;