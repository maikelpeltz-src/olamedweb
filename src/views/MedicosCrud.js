import React from 'react';
import Swal from 'sweetalert2';
import './css/lista_medicos.css';
import withReactContent from 'sweetalert2-react-content';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { ValidationForm, TextInput, BaseFormControl, SelectGroup, FileInput, Checkbox, Radio } from 'react-bootstrap4-form-validation';
import MaskedInput from 'react-text-mask';
import validator from 'validator';
import Aux from '../hoc/_Aux';
import pt from 'date-fns/locale/pt-BR';
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { medicoAuth, medicoCriar, medicoAtualizar, medicoSetField } from '../actions/';
import AnimatedModal from '../App/components/AnimatedModal';
import { store } from '../../src/index.js';
import Notifications from '../App/components/Notifications';
import axios from 'axios';
import { styleLine, styleDtPicker, styleBtCrm } from './css/crud_medicos';

registerLocale('pt-BR', pt)

class MaskWithValidation extends BaseFormControl {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
        this.state = {
            cancelar: 0,
        };
    }


    getInputRef() {
        return this.inputRef.current.inputElement;
    }

    handleChange = (e) => {
        this.checkError();
        if (this.props.onChange)
            this.props.onChange(e);
    };

    render() {
        return (
            <React.Fragment>
                <MaskedInput ref={this.inputRef} {...this.filterProps()} onChange={this.handleChange} />
                {this.displayErrorMessage()}
                {this.displaySuccessMessage()}
            </React.Fragment>
        )
    }
}


class MedicosCrud extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: new Date(),
            medico: '',
            id: localStorage.getItem('medico_editar'),
            verificarDados: 0,
            consultaErro: 0,
            variant: 'inverse',
            placement: 'top-right',
            autoDismiss: true,
            animation: {type: 'bounce', direction: 'top'},
            message: 'Bootstrap Growl Turning standard Bootstrap alerts into awesome notification'
        }
    }
    componentDidMount() {

    }
    chamarSoap() {
        var medico = store.getState().medico;
        if (medico.cpf != "" && medico.crm != "" && medico.cpf != "" && medico.dataNasc != "") {
            this.setState({
                verificarDados: 1,
            });
            var uf = medico.uf.toUpperCase();
            let envelope =
                `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://servico.cfm.org.br/">
           <soapenv:Header/>
           <soapenv:Body>
               <ser:ConsultaCompleta>
                 <crm>${medico.crm}</crm>
                 <!--Optional:-->
                 <uf>${uf}</uf>
                 <!--Optional:-->
                 <cpf>${medico.cpf}</cpf>
                 <!--Optional:-->
                 <dataNascimento>${medico.dataNasc}</dataNascimento>
                 <!--Optional:-->
                 <chave>4BUX14QE</chave>
               </ser:ConsultaCompleta>
           </soapenv:Body>
         </soapenv:Envelope>`;

            //console.log(envelope);

            var xmlhttp = new XMLHttpRequest();

            // example data
            const url = 'https://cors-anywhere.herokuapp.com/https://ws.cfm.org.br:8080/WebServiceConsultaMedicos/ServicoConsultaMedicos';

            xmlhttp.open('POST', url, true);
            xmlhttp.setRequestHeader('Content-Type', 'application/json'); //Obrigatorio API
            xmlhttp.setRequestHeader('access_token', '4BUX14QE'); //Obrigatorio API
            //var sr = '<?xml version="1.0" encoding="utf-8"?>' + envelope;
            var sr = envelope;

            xmlhttp.onreadystatechange = () => {
                if (xmlhttp.readyState == 4) {
                    if (xmlhttp.status == 200) {
                        console.log(xmlhttp.response)
                        this.loadXml(xmlhttp.response);
                    } else {
                        this.sweetAlertHandler({ title: 'Dados inválidos!', type: 'error', text: ' Verifique se o CRM, CPF, UF ou Data De Nascimento foram digitados corretamente!' })
                    }
                }
            }
            xmlhttp.send(sr);
            const sampleHeaders = {
                'user-agent': 'sampleTest',
                'Content-Type': 'text/xml;charset=UTF-8',
            };
        } else {
            this.sweetAlertHandler({ title: 'Dados incompletos', type: 'error', text: 'CRM, CPF, UF e Data De Nascimento devem estar preenchidos!' })
        }
    }

    loadXml(xmlText) {
        try {
            console.log(xmlText);
            var XMLParser = require('react-xml-parser');
            var xml = new XMLParser().parseFromString(xmlText);
            var codigoErro = xml.getElementsByTagName('codigoErro')[0].value;
            console.log(codigoErro);
            if (codigoErro == '0000') {
                this.setState({
                    verificarDados: 0,
                });
                var especialidades = xml.getElementsByTagName('especialidade')[0].value;
                var nome = xml.getElementsByTagName('nome')[0].value
                var dataAtualizacao = xml.getElementsByTagName('dataAtualizacao')[0].value
                var situacao = xml.getElementsByTagName('situacao')[0].value
                this.handleChange(null, 'especialidades', especialidades)
                this.handleChange(null, 'nome', nome)
                this.handleChange(null, 'dataAtualizacaoCFM', dataAtualizacao)
                if (situacao == 'A') {
                    this.handleChange(null, 'situacao', "Ativo")
                } else {
                    this.handleChange(null, 'situacao', "Inativo")
                }
            } else {
                this.setState({
                    verificarDados: 0,
                    consultaErro: 1,
                });
                //this.sweetAlertHandler({ title: 'Dados inválidos!', type: 'error', text: ' Verifique se o CRM, CPF, UF ou Data De Nascimento foram digitados corretamente!' })
            }
        } catch (error) {
            throw (error);
        }
    }

    handleChange = (e, field, value) => {
        this.props.medicoSetField(field, value);
    };

    setData = (date) => {
        this.setState({
            startDate: date,
        });
    };

    cancelar() {
        localStorage.setItem('medico_editar', '');
        this.setState({
            cancelar: 1,
            id: ''
        })
    }

    onSuccess() {
        return true;
    }

    onFailure() {
        return true;
    }

    async salvarUsuario(uid) {
        try {
            await this.props.medicoCriar(uid)
            this.cancelar();
        } catch (error) {
            this.sweetAlertHandler({ title: 'Erro ao salvar registro!', type: 'error', text: '' })
        }
    }
    sweetAlertHandler = (alert) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            type: alert.type
        });
    };

    handleSubmit = (e, formData, inputs) => {
        e.preventDefault();
        if (this.state.id == '') {
            var uid = '';
            this.props.medicoAuth()
                .then((id) => {
                    uid = id;
                    this.salvarUsuario(uid)
                })
                .catch(error => {
                    this.sweetAlertHandler({ title: 'Erro ao fazer registro!', type: 'error', text: '' })
                });

        } else {
            this.props.medicoAtualizar(this.state.id) //atualizar
                .then(e => {
                    this.cancelar();
                    this.sweetAlertHandler({ title: 'Usuário atualizado com sucesso!', type: 'success', text: '' })
                    return null;
                })
                .catch(error => {
                    this.sweetAlertHandler({ title: 'Erro ao atualizar registro!', type: 'error', text: '' })
                });
        }
    };

    handleErrorSubmit = (e, formData, errorInputs) => {
        this.sweetAlertHandler({ title: 'Preencha todos os campos corretamente!', type: 'error', text: '' })
    };

    /* matchPassword = (value) => {
        return value && value === this.props.medico.senha;
    };
 */
    formatDateToString(value) {
        var dia = value.getDate();
        var mes = value.getMonth() + 1;
        var ano = value.getFullYear();
        return dia + "/" + mes + "/" + ano;
    }

    formatStringToDate() {
        var value = this.props.medico.dataNasc;
        var dataResult = ''
        if (value === '' || value === undefined || value === null) {
            dataResult = new Date()
        } else {
            var dateParts = value.split("/");
            dataResult = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
        }
        return dataResult;
    }

    async validaCRM() {
        await this.props.medicoCriar('adsasd');
    }

    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h5">Cadastrar Médico</Card.Title>
                                {this.state.cancelar > 0 ? <Redirect to="/medicos" /> : null}
                            </Card.Header>
                            <Card.Body>
                                <ValidationForm onSubmit={this.handleSubmit} onErrorSubmit={this.handleErrorSubmit}>
                                    <Form.Row>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label htmlFor="crm">CRM</Form.Label>
                                            <MaskWithValidation
                                                name="crm"
                                                className="form-control"
                                                mask={[/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]}
                                                id="crm"
                                                placeholder="CRM"
                                                errorMessage="Campo de CRM é obrigatório"
                                                required
                                                value={this.props.medico.crm}
                                                onChange={(e) => this.handleChange(e, 'crm', e.target.value)}
                                                autoComplete="off"
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label htmlFor="uf">UF</Form.Label>
                                            <TextInput
                                                name="uf"
                                                id="uf"
                                                placeholder="UF"
                                                maxLength="2"
                                                minLength="2"
                                                required
                                                errorMessage="Campo de UF é obrigatório"
                                                value={this.props.medico.uf}
                                                onChange={(e) => this.handleChange(e, 'uf', e.target.value)}
                                                autoComplete="off"
                                            />
                                        </Form.Group>

                                        <Form.Group as={Col} md="6">
                                            <Form.Label htmlFor="cpf">CPF</Form.Label >
                                            <MaskWithValidation
                                                name="cpf"
                                                id="cpf"
                                                className='form-control'
                                                mask={[/[0-9]/, /[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/]}
                                                placeholder="CPF"
                                                minLength = "14"
                                                errorMessage="Campo de CPF é obrigatório"
                                                required value={this.props.medico.cpf}
                                                onChange={(e) => this.handleChange(e, 'cpf', e.target.value)}
                                                autoComplete="off"
                                                
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label htmlFor="cpf">Data Nasc.</Form.Label >
                                            <Row style={styleLine}>
                                                <br></br>
                                                <Col style={styleDtPicker}>
                                                    <DatePicker
                                                        dateFormat="dd/MM/yyyy"
                                                        selected={this.formatStringToDate()}
                                                        onChange={(value, e) => this.handleChange(e, 'dataNasc', this.formatDateToString(value))}
                                                        showYearDropdown
                                                        required
                                                        className="form-control"
                                                        locale="pt-BR"
                                                    />
                                                </Col>
                                                <Col style={styleBtCrm}>
                                                    <Button onClick={(e) => { this.chamarSoap() }}>
                                                        {this.state.verificarDados != 0 ?
                                                            <span className="spinner-border spinner-border-sm mr-1" role="status" />
                                                            : null}
                                                        {this.state.verificarDados != 0 ?
                                                            'Validando...' : 'Validar dados'
                                                        }
                                                        {this.state.consultaErro > 0 ?
                                                        <Notifications notification={this.state}></Notifications>
                                                        : null
                                                        }

                                                        
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label htmlFor="nome">Nome</Form.Label>
                                            <TextInput
                                                name="nome"
                                                id="nome"
                                                maxLength="50"
                                                placeholder="Nome"
                                                className="form-control"
                                                required
                                                errorMessage="Campo de Nome é obrigatório"
                                                onChange={(e) => this.handleChange(e, 'nome', e.target.value)}
                                                value={this.props.medico.nome}
                                                autoComplete="off"
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label htmlFor="url">Situacão</Form.Label>
                                            <TextInput
                                                name="situacao"
                                                id="situacao"
                                                type="situacao"
                                                placeholder="Situação"
                                                errorMessage="Campo de Situação é obrigatório"
                                                required
                                                onChange={(e) => this.handleChange(e, 'situacao', e.target.value)}
                                                value={this.props.medico.situacao}
                                                autoComplete="off"
                                            />
                                        </Form.Group>

                                        <Form.Group as={Col} md="6">
                                            <Form.Label htmlFor="especialidades">Especialidades</Form.Label>
                                            <TextInput
                                                name="especialidades"
                                                id="especialidades"
                                                placeholder="Especialidades"
                                                errorMessage="Campo de Especialidades é obrigatório"
                                                required
                                                value={this.props.medico.especialidades}
                                                onChange={(e) => this.handleChange(e, 'especialidades', e.target.value)}
                                                autoComplete="off"
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label htmlFor="dataAtualizacaoCFM">Data Atualização</Form.Label>
                                            <TextInput
                                                name="dataAtualizacaoCFM"
                                                id="dataAtualizacaoCFM"
                                                placeholder="Data atualização CFM"
                                                required
                                                errorMessage="Digite uma data válida"
                                                value={this.props.medico.dataAtualizacaoCFM}
                                                onChange={(e) => this.handleChange(e, 'dataAtualizacaoCFM', e.target.value)}
                                                autoComplete="off"
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label htmlFor="telefone">Telefone</Form.Label>
                                            <MaskWithValidation
                                                name="telefone"
                                                id="telefone"
                                                placeholder="Telefone"
                                                className="form-control"
                                                required
                                                value={this.props.medico.telefone}
                                                onChange={(e) => this.handleChange(e, 'telefone', e.target.value)}
                                                errorMessage="Entre com um número de telefone válido"
                                                mask={['(', /[0-9]/, /[0-9]/, ')', ' ', /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]}
                                                autoComplete="off"
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label htmlFor="url">Foto de perfil</Form.Label>
                                            <TextInput
                                                name="url"
                                                id="url"
                                                type="url"
                                                placeholder="Foto de perfil"
                                                readOnly
                                                onChange={(e) => this.handleChange(e, 'fotoPerfil', e.target.value)}
                                                value="https://firebasestorage.googleapis.com/v0/b/olamed-41bba.appspot.com/o/users%2FKrSch2KNnbY5g1OIVkow9FBOUKK2%2Fprofile%2Fselfie.jpg?alt=media&token=404c5c38-aa72-49ba-bf14-58cf3108b70f"
                                                autoComplete="off"
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label htmlFor="email">Email</Form.Label>
                                            <TextInput
                                                name="email"
                                                id="email"
                                                type="email"
                                                required
                                                placeholder="Email"
                                                validator={validator.isEmail}
                                                errorMessage={{ validator: "Entre com um e-mail válido" }}
                                                value={this.props.medico.email}
                                                onChange={(e) => this.handleChange(e, 'email', e.target.value)}
                                                autoComplete="off"
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            {this.state.id == '' ?
                                                <Form.Label htmlFor="password">Senha</Form.Label>
                                                : null}
                                            {this.state.id == '' ?
                                                <TextInput
                                                    name="password"
                                                    id="password"
                                                    type="password"
                                                    placeholder="Password"
                                                    required
                                                    pattern="(?=.*[a-z]).{6,}"
                                                    errorMessage={{ required: "O campo Senha é obrigatório", pattern: "A senha deve conter no mínimo 6 caracteres e 1 letra." }}
                                                    value={this.props.medico.password}
                                                    onChange={(e) => this.handleChange(e, 'senha', e.target.value)}
                                                    autoComplete="off"
                                                /> : null}
                                        </Form.Group>

                                        <Form.Group as={Col} md="6" className="mt-3">
                                            {this.state.id == '' ?
                                                <Button className="btn-success"/*  onClick={() => this.trySalvar()} */ type="submit">
                                                    Cadastrar
                                                </Button> :
                                                <Button className="btn-success" /* onClick={() => this.trySalvar()} */ type="submit">
                                                    Salvar
                                                    </Button>
                                            }
                                            <Button className="btn-danger" onClick={() => this.cancelar()}>Cancelar</Button>
                                        </Form.Group>
                                    </Form.Row>
                                </ValidationForm>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Aux>
        );
    }
}

function mapStateToProps(state) {
    return {
        medico: state.medico,
    }
}

export default connect(mapStateToProps, { medicoAuth, medicoCriar, medicoAtualizar, medicoSetField })(MedicosCrud)
