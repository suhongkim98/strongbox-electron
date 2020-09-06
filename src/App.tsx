import React from 'react';
import styled from 'styled-components';


const TotalWrapper = styled.div`
background-color:red;
${({theme}) => theme.media.tablet`        
background-color:blue;
`}
`;
const App: React.FC = () => {
  return (
    <TotalWrapper>
      Hello Electron with react!
    </TotalWrapper>
  );
}

export default App;
