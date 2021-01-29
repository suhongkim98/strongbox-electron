import React from 'react';
import styled from 'styled-components';
import Span from '../../../components/Span';
import theme from '../../../styles/theme';

const TotalWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 100%;
`;
const InnerWrapper = styled.div`
    height: 50px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 80px;
`;
const SyncRequestPin = () => {

    return (<TotalWrapper>
        <InnerWrapper>
            <div>
                <Span size="2.5rem" fontWeight="700">ACCONG BOX</Span>
            </div>
            <div>
                <Span size="2rem">{global.name}</Span>
            </div>
        </InnerWrapper>
        <InnerWrapper>
            <div>
                <Span size="2rem">인증 번호</Span>
            </div>
            <div>
                <Span size="5rem" textColor={theme.colors.backgroundMainColor}  fontWeight="700">11111</Span>
            </div>
        </InnerWrapper>
        <InnerWrapper>
            <div>
                <Span size="2rem">유효시간 내에 인증 번호를 입력하세요.</Span>
            </div>
            <div>
                <Span size="2.5rem" textColor="red"  fontWeight="700">30</Span>
            </div>
        </InnerWrapper>
    </TotalWrapper>);
}

export default SyncRequestPin;
