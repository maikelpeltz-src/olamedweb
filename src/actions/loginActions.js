import firebase from '../config/firebase';
import 'firebase/auth';
import 'firebase/firestore';



firebase.auth().setPersistence("local");


export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
const userLoginSuccess = user => ({
    type: USER_LOGIN_SUCCESS,
    user
});

export const USER_LOGOUT = 'USER_LOGOUT';
const userLogout = () => ({
    type: USER_LOGOUT,
});


export const logOff = () => dispatch => {
    return (
        firebase
            .auth()
            .signOut()
            .then(() => {
                const action = userLogout();
                localStorage.setItem('email', '');
                localStorage.setItem('password', '');
                dispatch(action);
                return true;
            })
            .catch(error => {
                return Promise.reject(error)
            })
    )
}

export const getDados = (id) => dispatch => {
    const { currentUser } = firebase.auth();
    var db = firebase.firestore();
    var query = db.collection('users').doc(id).get();
    //var userRef = db.collection('users').doc(id);
    
    return (
        query.then(function (doc) {
            console.log("Nome do usuário com id: " +  id  + " é:" + doc.data().nome);
            return id;
        }).catch(function (error) {
            console.log("Error getting document:", error);
        }))
}



export const tryLogin = (email, password) => dispatch => {
    return (
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(user => {
                const action = userLoginSuccess(user);

                localStorage.setItem('email', email);
                localStorage.setItem('password', password);
                dispatch(action);


                const { currentUser } = firebase.auth();
                console.log("Usuario ID:" + currentUser.uid);
                console.log("Usuario ID:" + currentUser.email);


                return user;
            })
            .catch(error => {
                return Promise.reject(error)
            }
            )
    )
}

