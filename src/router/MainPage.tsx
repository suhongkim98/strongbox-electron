import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import FloatDiv from '../components/FloatDiv';
import LogoutSVG from '../images/LogoutSVG';
import SettingSVG from '../images/SettingSVG';
import { StrongboxDatabase } from '../StrongboxDatabase';
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

display: flex;
justify-content: space-between;
align-items: center;

padding-left: 25px;
padding-right: 25px;
`;

const NameHeaderInnerWrapper = styled.div`
display: flex;
justify-content: center;
align-items: center;
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

display: flex;
justify-content: center;
align-items: center;
`;

const FloatDivWrapper = styled.div`
width:97%;
height:97%;
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
    const [redirect, setRedirect] = useState("");
    const [name,setName] = useState("null");

    useEffect(() =>{
        const database = StrongboxDatabase.getInstance();
        database.select("NAME","USERS_TB","IDX = " + global.idx).then((result:any) =>{
            setName(result[0].NAME);
        }).catch((error)=>{
            console.log(error);
        });
    },[]);

    const onLogoutButtonClicked = () =>{
        global.idx = -1;
        global.key = "";
        setRedirect("/");
    }
    const onSettingButtonClicked = () =>{

    }

    if(redirect !== "") return <Redirect to={redirect}/>
    return <TotalWrapper>
        <SearchHeaderWrapper></SearchHeaderWrapper>
        <NameHeaderWrapper><NameHeaderInnerWrapper><Span textColor="white" size="3rem">{name}</Span><div onClick={onLogoutButtonClicked}><LogoutSVG width="30px" height="30px" color="white"/></div></NameHeaderInnerWrapper><NameHeaderInnerWrapper><div onClick={onSettingButtonClicked}><SettingSVG width="30px" height="30px" color="white"/></div></NameHeaderInnerWrapper></NameHeaderWrapper>
        <NavBarWrapper><AddFolderBtn><Span textColor="white" size="1.6rem">폴더 추가하기</Span></AddFolderBtn></NavBarWrapper>
        <MainWrapper><FloatDivWrapper><FloatDiv title="test" /></FloatDivWrapper></MainWrapper>
    </TotalWrapper>
}

export default MainPage;