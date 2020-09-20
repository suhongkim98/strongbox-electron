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
position:relative;
`;
const RowWrapper = styled.div`
width:100%;
display:flex;
text-align:center;
justify-content:center;
`;
interface MarginRowWrapperProps{
    marginTop?:string;
}
const MarginRowWrapper = styled(RowWrapper)<MarginRowWrapperProps>`
${({marginTop}) =>
    marginTop &&
    `margin-top: ${marginTop}`
}
`;
const InputBoxWrapper = styled.div`
flex-grow:5;
`;
const Span = styled.span`
font-size:1.2rem;
`;

const SubmitBtn = styled.input`
border-style:solid;
border-radius:10px;
background-color:white;

width:200px;
height:40px;

position:absolute;
bottom:5px;
`;

const UserAddPage:React.FC = () =>{
    const onSubmitEvent = (e:any) =>{
        //console.log(e.target.nicknameInputBox.value); 처럼 접근
    }

    return <TotalWrapper>
        <FloatDivWrapper><FloatDiv title="사용자 추가" returnURL="/">
            <Form onSubmit={onSubmitEvent}>
            <RowWrapper>
                <InputBoxWrapper><AnimInputBox inputType="text" label="닉네임" name="nicknameInputBox"/></InputBoxWrapper>
            </RowWrapper>
            <RowWrapper><Span>핀번호 입력</Span><InputBoxWrapper><PinInputBox count={6} /></InputBoxWrapper></RowWrapper>
            <MarginRowWrapper marginTop="100px">
                <Span>( ! ) 사용자 정보는 컴퓨터 로컬DB에 암호화하여 저장됩니다.
                <br/><br/>핀번호는 데이터를 암호화하기 위한 중요한 암호입니다.<br/>분실하면 복구가 불가능하니 신중하게 설정해주세요.</Span>
            </MarginRowWrapper>
            <RowWrapper><SubmitBtn type="submit" value="등록" /></RowWrapper>

            </Form>
            </FloatDiv></FloatDivWrapper>
    </TotalWrapper>

}

export default UserAddPage;