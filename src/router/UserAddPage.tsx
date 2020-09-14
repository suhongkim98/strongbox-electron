import React from 'react';
import styled from 'styled-components';
import AnimInputBox from '../components/AnimInputBox';
import FloatDiv from '../components/FloatDiv';
import PinInputBox from '../components/PinInputBox';

const TotalWrapper = styled.div`
height: 100vh;
display:flex;
justify-content:center;
align-items:center;
`;
const ContentWrapper = styled.div`
width:500px;
height:440px;
`;

const UserAddPage:React.FC = () =>{
    return <TotalWrapper>
        <ContentWrapper><FloatDiv title="사용자 추가">
            <form>
            <AnimInputBox inputType="text" label="닉네임" />
            <PinInputBox count={6} />
            </form>
            </FloatDiv></ContentWrapper>
    </TotalWrapper>

}

export default UserAddPage;