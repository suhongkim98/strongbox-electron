import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../modules';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import AddFolderPopup from '../components/AddFolderPopup';
import FloatDiv from '../components/FloatDiv';
import GroupFolder from '../components/GroupFolder';
import LogoutSVG from '../images/LogoutSVG';
import SettingSVG from '../images/SettingSVG';
import { StrongboxDatabase } from '../StrongboxDatabase';
import theme from '../styles/theme';
import { update } from '../modules/groupList';

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

overflow: hidden;
`;
const NavBarGroupWrapper = styled.div`
width:100%;
height:calc(100% - 50px);

padding:10px 0 0 0;
`;
const NavBarGroupInnerWrapper = styled.div`
margin-bottom:5px;
`;
const NavBarFooterWrapper = styled.div`
width:100%;
height:50px;

display: flex;
justify-content:center;
align-items:center;
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

const AddFolderBtn = styled.button`

border-style:solid;
border-width:1px;
border-radius:5px;
border-color:gray;
padding:5px 50px;

cursor: pointer;
`;
const Scroll = styled.div`
width:100%;
height:100%;
overflow: auto;
::-webkit-scrollbar{
    width:10px;
    display:none;
}
`;
// global idx = 대상 유저 idx, global key = 대칭키 암호키
const MainPage:React.FC = () =>{
    const [redirect, setRedirect] = useState("");
    const [name,setName] = useState("null");
    const [addFolderPopup,setAddFolderPopup] = useState(false);
    const dispatch = useDispatch(); 

    const groupList = useSelector((state: RootState) => state.groupList.list); // 그룹리스트 redux

    const updateGroupList = (newList: any) =>{
        //updateGroupList함수를 실행하면 dispatch를 호출해서 redux 상태변화를 일으킴
        dispatch(update(newList));
    }
    useEffect(() =>{
        const database = StrongboxDatabase.getInstance();
        database.select("NAME","USERS_TB","IDX = " + global.idx).then((result:any) =>{
            setName(result[0].NAME);
        }).catch((error)=>{
            console.log(error);
        });

        database.getGroupList(global.idx).then((result)=>{
            updateGroupList(result);
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
    const onClickAddFolderBtn = () =>{
        setAddFolderPopup(true);
    }

    if(redirect !== "") return <Redirect to={redirect}/>
    return <TotalWrapper>
        {
            //각종 fixed 컴포넌트들
            addFolderPopup && <AddFolderPopup onBackgroundClicked={()=>{setAddFolderPopup(false)}} />

        }
        <SearchHeaderWrapper></SearchHeaderWrapper>
        <NameHeaderWrapper><NameHeaderInnerWrapper><Span textColor="white" size="3rem">{name}</Span><div onClick={onLogoutButtonClicked}><LogoutSVG width="30px" height="30px" color="white"/></div></NameHeaderInnerWrapper><NameHeaderInnerWrapper><div onClick={onSettingButtonClicked}><SettingSVG width="30px" height="30px" color="white"/></div></NameHeaderInnerWrapper></NameHeaderWrapper>
        <NavBarWrapper>
            <NavBarGroupWrapper><Scroll>
                {groupList.map((data:any)=>{return <NavBarGroupInnerWrapper><GroupFolder groupIdx={data.IDX} groupName={data.GRP_NAME}/></NavBarGroupInnerWrapper>})}
            </Scroll></NavBarGroupWrapper>
            <NavBarFooterWrapper>
            <AddFolderBtn onClick={onClickAddFolderBtn}><Span textColor="white" size="1.6rem">폴더 추가하기</Span></AddFolderBtn>
            </NavBarFooterWrapper>
        </NavBarWrapper>
        <MainWrapper><FloatDiv width="97%" height="97%" title="test" /></MainWrapper>
    </TotalWrapper>
}

export default MainPage;