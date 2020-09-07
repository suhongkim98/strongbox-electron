import React from 'react';
import styled from 'styled-components';
import theme from './styles/theme';
import RootPageRouter from './router/RootPageRouter';


const TotalWrapper = styled.div`
width:100%;
height:100vh;
background-color:${theme.colors.backgroundMainColor};
`;

const App: React.FC = () => {
  return (
    <TotalWrapper>
      <RootPageRouter />
    </TotalWrapper>
  );
}

export default App;
