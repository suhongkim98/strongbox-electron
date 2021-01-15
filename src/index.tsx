import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import GlobalStyle from './styles/GlobalStyles';
import { ThemeProvider } from './styles/theme-components';
import theme from './styles/theme';
import rootReducer from './modules';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { composeWithDevTools } from 'redux-devtools-extension';
import ReduxThunk from 'redux-thunk';


const store = createStore(
    rootReducer,
    // logger 를 사용하는 경우, logger가 가장 마지막에 와야합니다.
    composeWithDevTools(applyMiddleware(ReduxThunk))
  ); // 여러개의 미들웨어를 적용 할 수 있습니다.

//일반 react 프로젝트에는 라우터를 사용할 때 BrowserRouter를 사용했는데 electron에선 HashRouter을 사용해야 함
ReactDOM.render(
        <Provider store={store}>
        <GlobalStyle/>
        <HashRouter>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
        </HashRouter>
        </Provider>
        , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
