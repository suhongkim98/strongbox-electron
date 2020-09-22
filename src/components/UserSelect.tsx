import React, { useEffect, useState } from 'react';
import { StrongboxDatabase } from '../StrongboxDatabase';
import styled from 'styled-components';
import theme from '../styles/theme';
import { NavLink } from 'react-router-dom';

const TotalWrapper = styled.div`
width:100%;
height:100%;
background-color:${theme.colors.backgroundMainColor};
`;
const Row = styled.div`
:hover span{
    color:aqua;
}
`;
const Content = styled.div`
border-style:solid;
border-color:grey;
border-bottom-width:1px;
background-color:${theme.colors.backgroundMainColor};

margin: 20px;
padding-bottom:10px;
`;
const Span = styled.span`
font-size:1.6rem;
color: white;
`;
const UserSelect:React.FC = () =>{
    const [userList, setUserList] = useState([]);
    
    useEffect(()=>{
        //사용자 불러와서 뿌리자
        const database = StrongboxDatabase.getInstance();
        database.select('IDX,NAME','USERS_TB').then((result: any)=>{
             const list =result.map((data:any)=>{
                 return <NavLink to = '/PasswordInputPage' key={data.IDX}>
                     <Row onClick={()=>onClickUser(data.IDX)}><Content><Span>{data.NAME}</Span></Content></Row>
                 </NavLink>});
            setUserList(list);
        }).catch((error)=>{
            console.log(error);
        });


    },[]);//빈 배열을 넣어 재실행 될 필요가 읍다는걸 알림

    const onClickUser = (idx:number) =>{
        //유저 리스트 중 유저 클릭했을 때
        //유저 idx를 글로벌변수에 저장
        global.idx = idx;
    }
    return <TotalWrapper>{userList}</TotalWrapper>;
}

export default UserSelect;