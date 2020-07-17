import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { ValidationForm, TextInput, BaseFormControl, SelectGroup, FileInput, Checkbox, Radio } from 'react-bootstrap4-form-validation';
import MaskedInput from 'react-text-mask';
import validator from 'validator';
import Aux from '../hoc/_Aux';
import DatePicker from "react-datepicker";
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { medicoAuth, medicoCriar, medicoAtualizar, medicoSetField } from '../actions/';
import AnimatedModal from '../App/components/AnimatedModal';


class MaskWithValidation extends BaseFormControl {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
        this.state = {
            cancelar: 0
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
            id: localStorage.getItem('medico_editar')
        }
    }
    componentDidMount() {

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

    async salvarUsuario(uid) {
        try {
            await this.props.medicoCriar(uid)
            this.cancelar();
        } catch (error) {
            this.sweetAlertHandler({title: 'Erro ao salvar registro!', type: 'error', text: ''})
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
                        this.sweetAlertHandler({title: 'Erro ao atualizar registro!', type: 'error', text: ''})
                    });

            } else {
                this.props.medicoAtualizar(this.state.id) //atualizar
                    .then(e => {
                        this.cancelar();
                        this.sweetAlertHandler({title: 'Usuário atualizado com sucesso!', type: 'success', text: ''})
                        return null;
                    })
                    .catch(error => {
                        this.sweetAlertHandler({title: 'Erro ao atualizar registro!', type: 'error', text: ''})
                    });
            }
    };

    handleErrorSubmit = (e, formData, errorInputs) => {
        this.sweetAlertHandler({title: 'Preencha todos os campos corretamente!', type: 'error', text: ''})
    };

    matchPassword = (value) => {
        return value && value === this.props.medico.senha;
    };

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
                                            <TextInput
                                                name="crm"
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
                                                minlenght="2"
                                                required
                                                errorMessage="Campo de UF é obrigatório"
                                                value={this.props.medico.uf}
                                                onChange={(e) => this.handleChange(e, 'uf', e.target.value)}
                                                autoComplete="off"
                                            />
                                        </Form.Group>

                                        <Form.Group as={Col} md="6">
                                            <Form.Label htmlFor="cpf">CPF</Form.Label >
                                            <TextInput
                                                name="cpf"
                                                id="cpf"
                                                placeholder="CPF"
                                                errorMessage="Campo de CPF é obrigatório"
                                                required value={this.props.medico.cpf}
                                                onChange={(e) => this.handleChange(e, 'cpf', e.target.value)}
                                                autoComplete="off"
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label htmlFor="cpf">Data Nasc.</Form.Label >
                                            <br></br>
                                            <DatePicker
                                                dateFormat="dd/MM/yyyy"
                                                selected={this.formatStringToDate()}
                                                onChange={(value, e) => this.handleChange(e, 'dataNasc', this.formatDateToString(value))}
                                                showYearDropdown
                                                className="form-control" />
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label htmlFor="nome">Nome</Form.Label>
                                            <TextInput
                                                name="nome"
                                                id="nome"
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
