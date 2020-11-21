import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../modules';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import AddFolderPopup from '../components/AddFolderPopup';
import GroupFolder from '../components/GroupFolder';
import SettingSVG from '../images/SettingSVG';
import { StrongboxDatabase } from '../StrongboxDatabase';
import { updateGroup } from '../modules/groupList';
import { updateService } from '../modules/serviceList';
import Span from '../components/Span';
import { updateSelectedItemIndex } from '../modules/selectedService';
import theme from '../styles/theme';
import FolderSVG from '../images/FolderSVG';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';


const TotalWrapper = styled.div `
width:100%;
height:100vh;
display: grid;
grid-template-columns: 300px 1fr;
`;
const SearchHeaderWrapper = styled.div `
width:100%;
height:70px;

border-style:solid;
border-bottom-width:1px;
border-color:gray;
`;

const NavBarWrapper = styled.div`
width:100%;
height:100%;
background-color:${theme.colors.navBackgroundColor};
position:relative;
border-style:solid;
border-width:1px;
border-color:gray;

overflow: hidden;
`;
const NavBarGroupWrapper = styled.div`
width:100%;
height:calc(100% - 120px); // serach헤더, navbarfooter헤더 길이 뺴기

padding:10px 0 0 0;
`;

const NavBarFooterWrapper = styled.div`
width:100%;
height:50px;

display: flex;
justify-content:center;
align-items:center;
`;
const MainWrapper = styled.div`
position:relative;
width:100%;
height:100%;
`;

const MainHeader = styled.div`
width: 100%;
height: 70px;
background-color: #F2F2F2;
padding: 0 30px 0 30px;

display:flex;
justify-content: space-between;
align-items: center;

border-style: solid;
border-bottom-width: 1px;
`;
const MainHeaderInnerWrapper = styled.div`
display:flex;
`;
const MainHeaderItem = styled.div`
display: flex;
justify-content:center;
align-items:center;
padding-left: 14px;
`;
const MainHeaderProfile = styled(MainHeaderItem)`
:hover{
    Span{
        text-decoration:underline;
    }
}
`;
const MainBody = styled.div`
width:100%;
height:calc(100% - 70px); //헤더길이 자르기
background-color: ${theme.colors.containerMainColor};
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
const CenterContent = styled.div`
width:100%;
height:100%;
display: flex;
justify-content:center;
align-items:center;
`;

// global idx = 대상 유저 idx, global key = 대칭키 암호키
const MainPage:React.FC = () =>{
    const [redirect, setRedirect] = useState("");
    const [name,setName] = useState("null");
    const [addFolderPopup,setAddFolderPopup] = useState(false);
    const dispatch = useDispatch(); 

    const groupList = useSelector((state: RootState) => state.groupList.list); // 그룹리스트 redux
    const selectedService = useSelector((state: RootState)=>state.selectedService.itemIndex);

    const updateGroupList = (newList: any) =>{
        //updateGroupList함수를 실행하면 dispatch를 호출해서 redux 상태변화를 일으킴
        dispatch(updateGroup(newList));
    }
    const updateServiceList = (newList: any) =>{
        dispatch(updateService(newList));
    }
    const resetSelectedServiceIndex = () =>{
        dispatch(updateSelectedItemIndex({idx:-1,name:"no-name"}));
    }

    useEffect(() =>{
        const database = StrongboxDatabase.getInstance();
        database.select("NAME","USERS_TB","IDX = " + global.idx).then((result:any) =>{
            setName(result[0].NAME);
        }).catch((error)=>{
            console.log(error);
        });

        database.getGroupList(global.idx).then((result)=>{
            updateGroupList(result.map((data:any)=>{return {GRP_IDX: data.IDX, GRP_NAME: data.GRP_NAME}}));
        });

        database.getServiceListByUserIDX(global.idx).then((result)=>{
            updateServiceList(result.map((data:any)=>{return {GRP_IDX: data.GRP_IDX,GRP_NAME: data.GRP_NAME, SERVICE_IDX: data.SERVICE_IDX, SERVICE_NAME: data.SERVICE_NAME}}));
        }).catch((error)=>{
            console.log(error);
        });
    },[]);

    const resetInformation = () =>{
        resetSelectedServiceIndex();
        global.idx = -1;
        global.key = "";
    }

    const onLogoutButtonClicked = () =>{
        resetInformation();
        setRedirect("/");
    }

    const onSettingButtonClicked = () =>{

    }

    if(redirect !== "") return <Redirect to={redirect}/>
    return <TotalWrapper>
        {
            //각종 fixed 컴포넌트들
            addFolderPopup && <AddFolderPopup onBackgroundClicked={()=>{setAddFolderPopup(false)}} />
        }
        <ContextMenu id="profile">
            <MenuItem onClick={onLogoutButtonClicked}>로그아웃</MenuItem>
        </ContextMenu>
        <NavBarWrapper>
            <SearchHeaderWrapper><Span textColor="white" size="1.6rem">아이디검색영역</Span></SearchHeaderWrapper>
            <NavBarGroupWrapper><Scroll>
                {groupList.map((data:any) =>{return <GroupFolder key={data.GRP_IDX} groupIdx={data.GRP_IDX} groupName={data.GRP_NAME} />})}
            </Scroll></NavBarGroupWrapper>
            <NavBarFooterWrapper>
            <AddFolderBtn onClick={()=>{setAddFolderPopup(true)}}><Span textColor="white" size="1.6rem">폴더 추가하기</Span></AddFolderBtn>
            </NavBarFooterWrapper>
        </NavBarWrapper>
        <MainWrapper>
        <MainHeader>
        <MainHeaderInnerWrapper>{selectedService['idx'] > 0 && <CenterContent><FolderSVG width="40px" height="40px"/><MainHeaderItem><Span textColor="black" size="4rem">{selectedService['name']}</Span></MainHeaderItem></CenterContent>}  </MainHeaderInnerWrapper>  
        <MainHeaderInnerWrapper>
        <MainHeaderProfile><ContextMenuTrigger id="profile" holdToDisplay={0}><Span textColor="black" size="2rem">{name}</Span></ContextMenuTrigger></MainHeaderProfile>
        <MainHeaderItem><div onClick={onSettingButtonClicked}><SettingSVG width="30px" height="30px" color="black"/></div></MainHeaderItem></MainHeaderInnerWrapper></MainHeader>
        <MainBody>
        {
        selectedService['idx'] > 0 ? selectedService['name'] : <CenterContent><Span textColor="black" size="2rem" fontWeight="700" center>환영합니다!<br/>계정을 추가하거나 선택해주세요.</Span></CenterContent>
        }</MainBody></MainWrapper>
    </TotalWrapper>
}

export default MainPage;