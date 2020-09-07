import React from 'react';
import styled from 'styled-components';
import CounterContainer from './containers/CounterContainer';
import { Route, NavLink, HashRouter } from 'react-router-dom';


const TotalWrapper = styled.div`
background-color:red;
${({theme}) => theme.media.tablet`        
background-color:blue;
`}
`;

const RouterHome: React.FC = () =>{
  return<div>home</div>;
}

const Router1: React.FC = () =>{
  return <div>test1</div>;
}
const Router2: React.FC = () =>{
  return <div>test2</div>;
}
//일반 react 프로젝트랑은 라우터 사용법이 살 짞 다름
const App: React.FC = () => {
  return (
    <TotalWrapper>
      <CounterContainer />
      <NavLink to="/r1">r1</NavLink>
      <NavLink to="/r2">r2</NavLink>
      <HashRouter>
        <Route path="/" exact component={RouterHome}></Route>
        <Route path="/r1" component={Router1}></Route>
        <Route path="/r2" component={Router2}></Route>
      </HashRouter>
    </TotalWrapper>
  );
}

export default App;
