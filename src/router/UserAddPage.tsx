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
const FloatDivWrapper = styled.div`
width:500px;
height:440px;
`;
const Form = styled.form`
width:100%;
height:100%;
display:flex;
flex-direction:column;
justify-content:space-between;
align-items:center;
`;
const RowWrapper = styled.div`
width:100%;
display:flex;
text-align:center;
justify-content:center;
`;
const InputBoxWrapper = styled.div`
flex-grow:5;
`;
const NickButtonWrapper = styled.div`
flex-grow:1;
`;
const DoubleCheckBtn = styled.input`
width:100%;
margin: 0 auto;
line-height:35px;
margin-left:5px;

border-style:solid;
border-radius:10px;
`;

const Span = styled.span`
font-size:1.6rem;
`;

const SubmitBtn = styled.input`
border-style:solid;
border-radius:10px;
background-color:white;

width:100px;
height:40px;

`;

const UserAddPage:React.FC = () =>{
    return <TotalWrapper>
        <FloatDivWrapper><FloatDiv title="사용자 추가">
            <Form>
            <RowWrapper>
                <InputBoxWrapper><AnimInputBox inputType="text" label="닉네임" /></InputBoxWrapper>
                <NickButtonWrapper><DoubleCheckBtn type="button" value="중복 확인" /></NickButtonWrapper>
            </RowWrapper>
            <RowWrapper><Span>핀번호 입력</Span><InputBoxWrapper><PinInputBox count={6} /></InputBoxWrapper></RowWrapper>
            <RowWrapper>
                <Span>( ! ) 사용자 정보는 컴퓨터 로컬DB에 암호화하여 저장됩니다.
                <br/><br/>핀번호는 데이터를 암호화하기 위한 중요한 암호입니다.<br/>분실하면 복구가 불가능하니 신중하게 설정해주세요.</Span>
            </RowWrapper>
            <SubmitBtn type="submit" value="등록" />
            </Form>
            </FloatDiv></FloatDivWrapper>
    </TotalWrapper>

}

export default UserAddPage;