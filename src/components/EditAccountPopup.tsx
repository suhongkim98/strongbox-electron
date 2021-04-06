import React, { useState } from 'react';
import styled from 'styled-components';
import PopupFloatDiv from './PopupFloatDiv';
import Span from './Span';
import { toast, ToastContainer } from 'react-toastify';
import { StrongboxDatabase } from '../StrongboxDatabase';
import { useDispatch, useSelector } from 'react-redux';
import Dropbox from './Dropbox';
import { RootState } from '../modules';
import StaticInputBox from './StaticInputBox';
import { useEffect } from 'react';
import { updateAccountAsync } from '../modules/accountList';

interface PopupProps {
    onBackgroundClicked: () => any;
    accountIdx: number;
}
const SubmitBtn = styled.button`
position:absolute;
bottom:35px;
left:50%;
transform:translateX(-50%);

width: 230px;
height: 40px;
background-color:white;
border-style:solid;
border-color:black;
border-width:1px;
border-radius:5px;
`;
const BodyWrapper = styled.div`
    position: relative;
    height: 400px;
`;
const BodyItem = styled.div`
    margin: 0 0 20px 0;
`;
const EditAccountPopup = ({ onBackgroundClicked, accountIdx }: PopupProps) => {
    const [nickname, setNickname] = useState('');
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [selectedGroupIdx, setSelectedGroupIdx] = useState(-1);
    const [selectedServiceIdx, setSelectedServiceIdx] = useState(-1);
    const [targetServiceList, setTargetServiceList] = useState([]);
    const groupList = useSelector((state: RootState) => state.groupList.list);
    const serviceList = useSelector((state: RootState) => state.serviceList.list);
    const selectedService = useSelector((state: RootState) => state.selectedService.itemIndex);
    const dispatch = useDispatch();

    const [originalServiceIdx, setOriginalServiceIdx] = useState(-1);
    const [originalPlaceholderId, setOriginalPlaceholderId] = useState('');
    const [originalPlaceholderPassword, setOriginalPlaceholderPassword] = useState('');
    const [originalAccountName, setOriginalAccountName] = useState('');


    useEffect(() => {
        const db = StrongboxDatabase.getInstance();
        db.getAccountInfo(accountIdx, false).then((result: any) => {
            setOriginalServiceIdx(result.SERVICE_IDX);
            setOriginalPlaceholderId(result.ID);
            setOriginalPlaceholderPassword(result.PASSWORD);
            setOriginalAccountName(result.ACCOUNT_NAME);
        }).catch((error) => {
            console.error(error);
        });
    }, [accountIdx]);

    useEffect(() => {
        setSelectedServiceIdx(-1);
        const tmp = serviceList.filter((row:any) => {return row.GRP_IDX === selectedGroupIdx * 1});
        const list = tmp.map((row:any) => {return <option key={row.SERVICE_IDX} value={row.SERVICE_IDX}>{row.SERVICE_NAME}</option>;});
        setTargetServiceList(list);
    }, [selectedGroupIdx, serviceList]);

    const onSubmit = () => {
        const db = StrongboxDatabase.getInstance();
        const inputServiceIdx = selectedServiceIdx !== -1 ? selectedServiceIdx : originalServiceIdx;
        const inputId = id !== '' ? id : originalPlaceholderId;
        const inputPassword = password !== '' ? password : originalPlaceholderPassword;
        const inputNickname = nickname !== '' ? nickname : undefined;

        db.changeAccountInfo(accountIdx, false, inputServiceIdx, inputId, inputPassword,inputNickname).then((result) => {
            if(result) {
                // 성공
                dispatch(updateAccountAsync(selectedService.idx));
                onBackgroundClicked();
            } else {
                toast.error('이미 존재하는 이름입니다.', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }).catch((error) => {
            console.error(error);
        });
    }
    return <PopupFloatDiv
        title="계정 편집"
        onBackgroundClicked={onBackgroundClicked}>
        <ToastContainer />
        <BodyWrapper>
            <BodyItem>
                <Span size="1.2rem">그룹 선택</Span>
                <Dropbox setSelectedFunc={setSelectedGroupIdx} defaultOptionName="변경 원할 시 선택">
                    {groupList.map((group: any) => {return <option key={group.GRP_IDX} value={group.GRP_IDX} >{group.GRP_NAME}</option>;})}
                </Dropbox>
            </BodyItem>
            <BodyItem>
                <Span size="1.2rem">서비스 선택</Span>
                <Dropbox setSelectedFunc={setSelectedServiceIdx} defaultOptionName="변경 원할 시 선택">
                    {targetServiceList}
                </Dropbox>
            </BodyItem>
            <BodyItem>
                <StaticInputBox placeholder={originalPlaceholderId} label="아이디" inputType="text" onChange={(e) => setId(e.target.value)} />
                <SubmitBtn onClick={onSubmit}><Span size="1.5rem" fontWeight="700">변경하기</Span></SubmitBtn>
                <StaticInputBox placeholder={originalPlaceholderPassword} label="비밀번호" inputType="text" onChange={(e) => setPassword(e.target.value)} />
                <SubmitBtn onClick={onSubmit}><Span size="1.5rem" fontWeight="700">변경하기</Span></SubmitBtn>
                <StaticInputBox placeholder={originalAccountName} label="별명" inputType="text" onChange={(e) => setNickname(e.target.value)} />
                <SubmitBtn onClick={onSubmit}><Span size="1.5rem" fontWeight="700">변경하기</Span></SubmitBtn>
            </BodyItem>
        </BodyWrapper>
    </PopupFloatDiv>
}

export default EditAccountPopup;