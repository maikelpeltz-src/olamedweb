import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose  } from 'redux';
import {Provider} from 'react-redux';
import reduxThunk from 'redux-thunk';
import {BrowserRouter} from 'react-router-dom';

import App from './App/index';
import * as serviceWorker from './serviceWorker';

import config from './config';


import rootReducer from '../src/reducers';



import userReducer from '../src/reducers/usuarioReducer';
import medicoReducer from '../src/reducers/medicoReducer';
import medicoListarReducer from '../src/reducers/medicoListarReducer';


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

//const store = createStore(reducer);

export const store = createStore( rootReducer, composeEnhancers(
	applyMiddleware(reduxThunk)
));



const app = (
    <Provider store={store}>
        <BrowserRouter basename={config.basename}>
            {/* basename="/datta-able" */}
            <App />
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
