import React from 'react';
import styled from 'styled-components';
import FloatDiv from '../components/FloatDiv';

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
            내용
            </FloatDiv></ContentWrapper>
    </TotalWrapper>

}

export default UserAddPage;