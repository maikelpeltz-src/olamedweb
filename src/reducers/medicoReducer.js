import { MEDICO_INSERIR, 
         MEDICO_SET_FIELD, 
         MEDICO_SET_CURRENT } from '../actions';

const INITIAL_STATE = {
            crm  : '', //puxa por json
            uf : '',
            cpf : '',
            dataNasc : '',
            nome : '', //puxa por json
            situacao: '',
            especialidades : '', //puxa por json
            dataAtualizacaoCFM : '', //puxa por json
            telefone : '',
            fotoPerfil : '',
            email : '',
            senha : '', //Não é necessário aqui
            ativo: 1,
}

export default function userReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case MEDICO_INSERIR:
            return action.medico;
        case MEDICO_SET_CURRENT:
            return action.medico;
        case MEDICO_SET_FIELD:
            const newState = { ...state };
            newState[action.field] = action.value;
            return newState;
		default:
			return state;
	}
}