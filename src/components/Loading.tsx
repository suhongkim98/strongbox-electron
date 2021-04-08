import React from 'react';
import styled from 'styled-components';
import AnimationLoading from '../images/AnimationLoading';
import Span from './Span';

const LoadingWrapper = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const LoadingBackground = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: black;
    opacity: 0.1;
`;
interface LoadingProps{
    text: string;
}
const Loading = ({text}: LoadingProps) => {
    return (<LoadingWrapper>
    <LoadingBackground />
    <Span size="1.6rem" fontWeight="700">{text}</Span>
    <AnimationLoading width="20px" height="20px" />
</LoadingWrapper>);
};

export default Loading;