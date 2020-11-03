import React from 'react';
import styled from 'styled-components';
interface SpanProps {
    textColor?:any;
    size?:any;
    fontWeight?:any;
    children?:any;
    draggable?:boolean;
}
const Wrapper = styled.span<SpanProps>`
${({textColor}) => 
//텍스트 컬러가 있다면
    textColor &&
    `color:${textColor};`
}

${({size}) => 
    size &&
    `font-size:${size};`
}

${({fontWeight}) => 
    fontWeight &&
    `font-weight:${fontWeight};`
}
${({draggable}) => // draggable true일 때만 드래그 가능하게 
    !draggable &&
    `
    -ms-user-select: none; 
    -moz-user-select: -moz-none; 
    -webkit-user-select: none; 
    -khtml-user-select: none; 
    user-select:none;`
}
`;

const Span = ({textColor,size,fontWeight,children,draggable}:SpanProps) =>{
return <Wrapper textColor={textColor} size={size} fontWeight={fontWeight} draggable={draggable}>{children}</Wrapper>
}

export default Span;