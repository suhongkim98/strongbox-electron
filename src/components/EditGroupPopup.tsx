import React, { useState } from 'react';
import styled from 'styled-components';
import AnimInputBox from './AnimInputBox';
import PopupFloatDiv from './PopupFloatDiv';
import Span from './Span';
import { toast, ToastContainer } from 'react-toastify';
import { StrongboxDatabase } from '../StrongboxDatabase';
import { useDispatch } from 'react-redux';
import { updateGroupAsync } from '../modules/groupList';

interface PopupProps {
    onBackgroundClicked: () => any;
    groupIdx: number;
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
    height: 150px;
`;
const EditGroupPopup = ({ onBackgroundClicked, groupIdx }: PopupProps) => {
    const [text, setText] = useState('');
    const dispatch = useDispatch();
    const onSubmit = () => {
        if (text === '') {
            //팝업   
            toast.error('변경하고자 하는 이름을 입력해주세요.', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {
            //이름 변경
            console.log(text);
            const db = StrongboxDatabase.getInstance();
            db.changeGroupName(groupIdx, text).then((result) => {
                if (result) {
                    // 성공
                    dispatch(updateGroupAsync());
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
    }
    return <PopupFloatDiv
        title="그룹 편집"
        onBackgroundClicked={onBackgroundClicked}>
        <ToastContainer />
        <BodyWrapper>
            <AnimInputBox label="이름 변경" inputType="text" onChange={(e) => setText(e.target.value)} />
            <SubmitBtn onClick={onSubmit}><Span size="1.5rem" fontWeight="700">변경하기</Span></SubmitBtn>
        </BodyWrapper>
    </PopupFloatDiv>
}

export default EditGroupPopup;