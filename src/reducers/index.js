import { combineReducers } from 'redux';

import reducer from '../store/reducer';
import userReducer from './usuarioReducer';
import medicoReducer from './medicoReducer';
import medicoListarReducer from './medicoListarReducer';




/* COLOCAR AS DEMAIS RECUCER */
export default combineReducers({
    native: reducer,
    user: userReducer,
    medico: medicoReducer,
    medicos: medicoListarReducer
});