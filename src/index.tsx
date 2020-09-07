import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import GlobalStyle from './styles/GlobalStyles';
import { ThemeProvider } from './styles/theme-components';
import theme from './styles/theme';
import rootReducer from './modules';
import { createStore } from 'redux';
import { Provider } from 'react-redux';


const store = createStore(rootReducer);

ReactDOM.render(
        <Provider store={store}>
        <GlobalStyle/>  
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
        </Provider>
        , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
