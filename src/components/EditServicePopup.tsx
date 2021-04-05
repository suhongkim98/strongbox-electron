import React, { useState } from 'react';
import styled from 'styled-components';
import AnimInputBox from './AnimInputBox';
import PopupFloatDiv from './PopupFloatDiv';
import Span from './Span';
import { toast, ToastContainer } from 'react-toastify';
import { StrongboxDatabase } from '../StrongboxDatabase';
import { useDispatch, useSelector } from 'react-redux';
import { updateServiceAsync } from '../modules/serviceList';
import Dropbox from './Dropbox';
import { RootState } from '../modules';

interface PopupProps {
    onBackgroundClicked: () => any;
    serviceIdx: number;
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
    height: 200px;
`;
const BodyItem = styled.div`
    margin: 0 0 20px 0;
`;
const EditServicePopup = ({ onBackgroundClicked, serviceIdx }: PopupProps) => {
    const [text, setText] = useState('');
    const [selectedGroupIdx, setSelectedGroupIdx] = useState(-1);
    const dispatch = useDispatch();
    const groupList = useSelector((state: RootState) => state.groupList.list);

    const onSubmit = () => {
        const db = StrongboxDatabase.getInstance();
            db.changeServiceName(serviceIdx, text !== '' ? text : undefined, selectedGroupIdx !== -1 ? selectedGroupIdx : undefined).then((result) => {
                if (result) {
                    // 성공
                    dispatch(updateServiceAsync());
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
            }).catch((error) => console.error(error));
    }
    return <PopupFloatDiv
        title="서비스 편집"
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
                <AnimInputBox label="이름 변경" inputType="text" onChange={(e) => setText(e.target.value)} />
                <SubmitBtn onClick={onSubmit}><Span size="1.5rem" fontWeight="700">변경하기</Span></SubmitBtn>
            </BodyItem>
        </BodyWrapper>
    </PopupFloatDiv>
}

export default EditServicePopup;