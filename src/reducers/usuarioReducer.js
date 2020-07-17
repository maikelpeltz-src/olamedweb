import { USER_LOGIN_SUCCESS, USER_LOGOUT } from '../actions';

const INITIAL_STATE = {
    usuarioEmail : '',
    usuarioLogado : 0
}


const userReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case USER_LOGIN_SUCCESS:
			return action.user;
		case USER_LOGOUT:
			return null;
		default:
			return state;
	}
}

export default userReducer;