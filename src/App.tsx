import React from 'react';
import styled from 'styled-components';
import CounterContainer from './containers/CounterContainer';


const TotalWrapper = styled.div`
background-color:red;
${({theme}) => theme.media.tablet`        
background-color:blue;
`}
`;
const App: React.FC = () => {
  return (
    <TotalWrapper>
      <CounterContainer />
    </TotalWrapper>
  );
}

export default App;
