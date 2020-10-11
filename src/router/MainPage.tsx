import React from 'react';
import styled from 'styled-components';
import theme from '../styles/theme';

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
const TotalWrapper = styled.div `
width:100%;
height:100vh;
display: grid;
grid-template-columns: 300px 1fr;
grid-template-rows: 74px 1fr;
`;
const SearchHeaderWrapper = styled.div `
width:100%;
height:100%;
background-color:${theme.colors.headerBackgroundColor};
border-style:solid;
border-width:1px;
border-color:gray;
`;
const NameHeaderWrapper = styled.div`
width:100%;
height:100%;
background-color:${theme.colors.headerBackgroundColor};
border-style:solid;
border-width:1px;
border-color:gray;
`;
const NavBarWrapper = styled.div`
width:100%;
height:100%;
position:relative;
border-style:solid;
border-width:1px;
border-color:gray;
`;
const MainWrapper = styled.div`
width:100%;
height:100%;
border-style:solid;
border-width:1px;
border-color:gray;
`;

const AddFolderBtn = styled.button`
position: absolute;
bottom:20px;
left:50%;
transform:translateX(-50%); // absolute 중앙정렬 방법

border-style:solid;
border-width:1px;
border-radius:5px;
border-color:gray;
padding:5px 50px;
`;

// global idx = 대상 유저 idx, global key = 대칭키 암호키
const MainPage:React.FC = () =>{

    return <TotalWrapper>
        <SearchHeaderWrapper></SearchHeaderWrapper>
        <NameHeaderWrapper></NameHeaderWrapper>
        <NavBarWrapper><AddFolderBtn><Span textColor="white" size="1.6rem">폴더 추가하기</Span></AddFolderBtn></NavBarWrapper>
        <MainWrapper></MainWrapper>
    </TotalWrapper>
}

export default MainPage;