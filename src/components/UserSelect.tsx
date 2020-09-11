import React, { useEffect, useState } from 'react';
import { StrongboxDatabase } from '../StrongboxDatabase';
import styled from 'styled-components';
import theme from '../styles/theme';
import { NavLink } from 'react-router-dom';

const TotalWrapper = styled.div`
width:100%;
height:100%;
border-style:solid;
border-color:grey;
border-width:1px;
background-color:${theme.colors.backgroundMainColor};
`;
const Content = styled.div`
padding:10px;
border-style:solid;
border-color:grey;
border-bottom-width:1px;
background-color:${theme.colors.backgroundMainColor};
`;
const Span = styled.span`
font-size:1.6rem;
color: white;
`;
const UserSelect:React.FC = () =>{
    const [userList, setUserList] = useState([]);
    
    useEffect(()=>{
        // //사용자 불러와서 뿌리자
        // const database = StrongboxDatabase.getInstance();
        // database.select('IDX,NAME','USERS_TB').then((result: any)=>{
            //  const list =result.map((data:any)=>{
            //      return <NavLink to = '/PasswordInputPage' key={data.IDX}>
            //          <Content onClick={()=>onClickUser(data.IDX)}><Span>{data.NAME}</Span></Content>
            //          </NavLink>});
        //     setUserList(list);
        // }).catch((error)=>{
        //     console.log(error);
        // });

        /////////받아오는거 잘 되는데 가짜데이터 삽입해서 디자인좀////////////////////////
        const fakeData: any = [{IDX: 1, NAME: '홍길동'},{IDX: 2, NAME: '김두식'},{IDX: 3, NAME: '두루미'},{IDX: 4, NAME: '갈매기'}];
        setUserList(fakeData.map((data:any)=>{return <NavLink to = '/PasswordInputPage' key={data.IDX}><Content onClick={()=>onClickUser(data.IDX)}><Span>{data.NAME}</Span></Content></NavLink>}));
        ////////////


    },[]);//빈 배열을 넣어 재실행 될 필요가 읍다는걸 알림

    const onClickUser = (idx:number) =>{
        //유저 리스트 중 유저 클릭했을 때
        //유저 idx를 글로벌변수에 저장
        global.idx = idx;
    }


    console.log(userList);
    return <TotalWrapper>{userList}</TotalWrapper>;
}

export default UserSelect;