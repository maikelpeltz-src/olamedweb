import firebase from '../config/firebase';
import axios from 'axios';
import 'firebase/auth';
import 'firebase/firestore';
import { firestore } from 'firebase';
import { store } from '../../src/index.js'
import { data } from 'jquery';
firebase.auth().setPersistence("local");

export const MEDICO_SET_FIELD = 'MEDICO_SET_FIELD';
export const medicoSetField = (field, value) => {
    return {
        type: MEDICO_SET_FIELD,
        field,
        value,
    }
}

export const MEDICO_INSERIR = 'MEDICO_INSERIR';
const medicoInserir = medico => ({
    type: MEDICO_INSERIR,
    medico
});


export const MEDICO_SET_CURRENT = 'MEDICO_SET_CURRENT';
const medicoSetCurrent = medico => ({
    type: MEDICO_SET_CURRENT,
    medico
});

export const medicoSetAtual = (id) => dispatch => {
    if (id == null) {
        var medico = {
            crm: '', //puxa por json
            uf: '',
            cpf: '',
            dataNasc: '',
            nome: '', //puxa por json
            situacao: '',
            especialidades: '', //puxa por json
            dataAtualizacaoCFM: '', //puxa por json
            telefone: '',
            fotoPerfil: '',
            email: '',
            senha: '', //Não é necessário aqui
            ativo: 1,
        }
        dispatch(medicoSetCurrent(medico));
    } else {
        var currentValue = store.getState().medicos;
        let medico = '';
        currentValue.map((item) => {
            if (item.id == id) {
                medico = item;
            }
        });
        dispatch(medicoSetCurrent(medico));
    }

}

export const medicoAtualizar = (id) => dispatch => {
    var medico = store.getState().medico;
    console.log('tryMedicoAtualizar');
    console.log(medico);
    var db = firebase.firestore();
    return (db.collection('users').doc(id).update({
        nome: medico.nome,
        crm: medico.crm,
        cpf: medico.cpf,
        uf: medico.uf,
        especialidades: medico.especialidades,
        telefone: medico.telefone,
        dataNasc: medico.dataNasc,
        situacao: medico.situacao,
        dataAtualizacaoCFM: medico.dataAtualizacaoCFM,
    })
        .then((result) => {
            return true;
        })
        .catch((error) => {
            alert('catch');
            return false;
        }))
}

function onSuccess(){
    return true;
}

function onFailure(){
    return true;
}



export const medicoCriar = (uid) => {
    var medico = store.getState().medico;
    console.log('uid');
    console.log(uid);
    console.log('medico nome');
    console.log(medico.dataNasc);
    console.log(medico.crm);
    console.log(medico.uf);
    console.log(medico.cpf);
    let envelope =
        `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"\
            xmlns:ser="http://servico.cfm.org.br/">\
        <soapenv: Header/>\
            <soapenv: Body>\
                <web: Validar>\
                    <crm>${medico.crm}</crm>\
                    <uf>${medico.uf}</uf>\
                    <cpf>${medico.cpf}</cpf>\
                    <dataNascimento>${medico.dataNasc}</dataNascimento>\
                    <chave>4BUX14QE</chave>\
                </web: Validar>\
    </soapenv: Body >\
  </soapenv: Envelope >`;
    console.log("ENVELOPE")
    console.log(envelope);
    
    var serviceUrl = "https://ws.cfm.org.br:8080/WebServiceConsultaMedicos/ServicoConsultaMedicos";
    axios.defaults.baseURL = 'http://olamed.com.br/';
    axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
    axios.get(serviceUrl, onSuccess, onFailure)
    .then(resp => {
    console.log("Funcionou");
    })
    .catch(error => {
    console.log(error);
    });



    return;


    let response = axios.post('https://ws.cfm.org.br:8080/WebServiceConsultaMedicos/ServicoConsultaMedicos', {
        headers: [{"Access-Control-Allow-Origin": ""},
                  {"Access-Control-Allow-Methods": "PUT, GET, POST, DELETE, OPTIONS"},
                  {"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization"},
                 ], body: envelope,
    });



    response.then(res => {
        console.log("axios entrou no then");
        console.log(res.status);
        console.log(res.statusText)
        var db = firebase.firestore();
        return async dispatch => {
            db.collection('users').doc(uid).set({
                nome: medico.nome,
                crm: medico.crm,
                cpf: medico.cpf,
                uf: medico.uf,
                email: medico.email,
                especialidades: medico.especialidades,
                telefone: medico.telefone,
                dataNasc: medico.dataNasc,
                situacao: medico.situacao,
                dataAtualizacaoCFM: medico.dataAtualizacaoCFM,
                ativo: 1
            });
            dispatch(medicoSetCurrent(medico))
        }
    }).catch(err => {
        console.log("axios entrou no catch");
        console.log(err)
    });
}


export const medicoAuth = () => dispatch => {
    var medico = store.getState().medico;
    console.log('createAuth');
    console.log(medico);
    console.log('medico nome');
    console.log(medico.nome);

    var db = firebase.firestore();
    return (
        firebase.auth().createUserWithEmailAndPassword(medico.email, medico.senha)
            .then((result) => {
                return result.user.uid;
            }).catch((erro) => {
                alert('NAO CRIOU AUTENTICACAO');
                return '';
            })
    )
}


export const medicoSetAtivo = (idMedico, estado) => dispatch => {
    var medico = store.getState().medico;
    console.log('tryMedicoAtualizar');
    console.log(medico);
    var db = firebase.firestore();
    return (db.collection('users').doc(idMedico).update({
        ativo: estado
    })
        .then((result) => {
            return true;
        })
        .catch((error) => {
            alert('catch');
            return false;
        }))
}