import React from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { connect } from 'react-redux';
import { tryLogin } from '../actions/';
import '../assets/scss/style.scss';
import Aux from "../hoc/_Aux";
import Breadcrumb from "../App/layout/AdminLayout/Breadcrumb";
import NotificationSystem from 'react-notification-system';

var notificacaoLoginErrado = '';
notificacaoLoginErrado = React.createRef()

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            isLoading: false,
            message: '',
            usuarioLogado: 0,
        }
    }

    addNotificationFalhaLogin() {

        const notification = notificacaoLoginErrado.current;
        notification.addNotification({
            message: 'Email e/ou senhas errados',
            level: 'error',
            position: 'tr',
            autoDismiss: 0
        });
    }

    componentDidMount() {

    }

    sweetAlertHandler = (alert) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            type: alert.type
        });
    };

    onChangeHandler(field, value) {
        this.setState({
            [field]: value
        });
    }

    mensagemValidacaoErro() {
        document.getElementById("messagemUI").click();
    }


    getMessageByErrorCode(errorCode) {
        switch (errorCode) {
            case 'auth/wrong-password':
                return 'Senha incorreta';
            case 'auth/user-not-found':
                return 'Usuário não encontrado';
            default:
                return 'Erro desconhecido';
        }
    }

    tryLogin() {

        this.setState({ isLoading: true, message: '' });

        const { email, password } = this.state;
        this.props.tryLogin(email, password)
            .then(user => {
                if (user) {
                    this.setState({ usuarioLogado: 1 });
                    return null;
                }
                return null;
            })
            .catch(error => {
                this.addNotificationFalhaLogin()
                this.setState({
                    isLoading: false,
                    message: this.getMessageByErrorCode(error.code)
                });
            });
    }
    render() {
        return (
            <Aux>
                <NotificationSystem ref={notificacaoLoginErrado} style={style} />
                {this.state.erroLogin > 0 ?
                    this.mensagemValidacaoErro()
                    : null
                }
                <Breadcrumb />
                <div className="auth-wrapper">
                    {this.state.usuarioLogado > 0 ? <Redirect to='/dashboard' /> : null}
                    <div className="auth-content">
                        <div className="auth-bg">
                            <span className="r" />
                            <span className="r s" />
                            <span className="r s" />
                            <span className="r" />
                        </div>
                        <div className="card">
                            <div className="card-body text-center">
                                <div className="mb-4">
                                    <i className="feather icon-unlock auth-icon" />
                                </div>
                                <h3 className="mb-4">Login</h3>
                                <div className="input-group mb-3">
                                    <input type="email" onChange={(e) => this.onChangeHandler('email', e.target.value)} className="form-control" placeholder="Email" />
                                </div>
                                <div className="input-group mb-4">
                                    <input type="password" onChange={(e) => this.onChangeHandler('password', e.target.value)} className="form-control" placeholder="password" />
                                </div>
                                <div className="form-group text-left">
                                    <div className="checkbox checkbox-fill d-inline">
                                        <input type="checkbox" name="checkbox-fill-1" id="checkbox-fill-a1" />
                                        <label htmlFor="checkbox-fill-a1" className="cr"> Save credentials</label>
                                    </div>
                                </div>
                                <button className="btn btn-primary shadow-2 mb-4" onClick={() => this.tryLogin()}>Login</button>
                                <p className="mb-2 text-muted">Forgot password? <NavLink to="/auth/reset-password-1">Reset</NavLink></p>
                                <p className="mb-0 text-muted">Don’t have an account? <NavLink to="/auth/signup-1">Signup</NavLink></p>
                            </div>
                        </div>
                    </div>
                </div>
            </Aux>
        );
    }
}
const style = {
    NotificationItem: { // Override the notification item

        error: {
            backgroundColor: '#FA6262',
            color: 'white',
        },
    }
}


export default connect(null, { tryLogin })(Login)
