import { MEDICO_LISTAR	} from '../actions';

const INITIAL_STATE = {
    medicos : [    ] 
}

export default function userReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case MEDICO_LISTAR:
            return action.medicos;
		default:
			return state;
	}
}