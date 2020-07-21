import React from 'react';
import { Redirect } from 'react-router-dom';
import { Row, } from 'react-bootstrap';
import { connect } from 'react-redux';
import { logOff } from '../actions/';
import '../assets/scss/style.scss';
import Aux from "../hoc/_Aux";

var notificacaoLoginErrado = '';
notificacaoLoginErrado = React.createRef()

class Logoff extends React.Component {
    constructor(props) {
        super(props);

    }

    realizarLogoff(){
        this.props.logOff();
    }

    render() {
        return (
            <Aux>
                <Row>
                    {this.realizarLogoff()}
                    <Redirect to="/login" />
                </Row>
            </Aux>
        );
    }
}



export default connect(null, { logOff  })(Logoff)
