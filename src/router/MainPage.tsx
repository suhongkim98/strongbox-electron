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
import { updateGroup } from '../modules/groupList';
import PlusSVG from '../images/PlusSVG';
import { updateService } from '../modules/serviceList';
import Span from '../components/Span';
import { updateSelectedItemIndex } from '../modules/selectedService';


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
border-style:solid;
border-width:1px;
border-color:gray;
`;
const NameHeaderWrapper = styled.div`
width:100%;
height:100%;
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
const ServiceAddBtn = styled.div`
width:90px;
height:90px;
background-color:darkred;
position:absolute;
bottom: 60px;
right: 60px;

border-width:1px;
border-style:solid;
border-color:black;
border-radius:50%;

display:flex;
justify-content:center;
align-items:center;
cursor: pointer;
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
            updateGroupList(result.map((data:any)=>{return <GroupFolder key={data.IDX} groupIdx={data.IDX} groupName={data.GRP_NAME}/>}));
        }).catch((error)=>{
            console.log(error);
        });

        database.getServiceListByUserIDX(global.idx).then((result)=>{
            updateServiceList(result.map((data:any)=>{return {GRP_IDX: data.GRP_IDX, SERVICE_IDX: data.SERVICE_IDX, SERVICE_NAME: data.SERVICE_NAME}}));
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
        <SearchHeaderWrapper></SearchHeaderWrapper>
        <NameHeaderWrapper><NameHeaderInnerWrapper><Span textColor="white" size="3rem">{name}</Span><div onClick={onLogoutButtonClicked}><LogoutSVG width="30px" height="30px" color="white"/></div></NameHeaderInnerWrapper><NameHeaderInnerWrapper><div onClick={onSettingButtonClicked}><SettingSVG width="30px" height="30px" color="white"/></div></NameHeaderInnerWrapper></NameHeaderWrapper>
        <NavBarWrapper>
            <NavBarGroupWrapper><Scroll>
                {groupList}
            </Scroll></NavBarGroupWrapper>
            <NavBarFooterWrapper>
            <AddFolderBtn onClick={()=>{setAddFolderPopup(true)}}><Span textColor="white" size="1.6rem">폴더 추가하기</Span></AddFolderBtn>
            </NavBarFooterWrapper>
        </NavBarWrapper>
        <MainWrapper>{
        selectedService['idx'] > 0 ? <FloatDiv width="100%" height="100%" title={selectedService['name']} ><ServiceAddBtn><PlusSVG width="40px" height="40px" color="white"/></ServiceAddBtn></FloatDiv>
        : <Span textColor="white" size="2rem" fontWeight="700" center>환영합니다!<br/>계정을 추가하거나 선택해주세요.</Span>
        }</MainWrapper>
    </TotalWrapper>
}

export default MainPage;