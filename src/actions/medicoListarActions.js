import firebase from '../config/firebase';
import 'firebase/auth';
import 'firebase/firestore';
import { firestore } from 'firebase';
firebase.auth().setPersistence("local");

export const MEDICO_LISTAR = 'MEDICO_LISTAR';
const medicosListar = (medicos) => ({
    type: MEDICO_LISTAR,
    medicos: medicos,
});

export const medicosLista = () => {
	return async dispatch => {
		var snapshot = await firebase.firestore().collection('users').get();
        var item = [];
        snapshot.docs.map(doc => {
            let tt = { ...doc.data(), id:  doc.id};
            item.push( tt);
         } );
        console.log("----------------Lista de Médicos------------------------");
        console.log(dispatch(medicosListar(item)));
        dispatch(medicosListar(item));
	}
}
