import React from 'react';

class itemclicked extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clicado: 0
        }
    }
    componentDidMount() {
        this.setState({
            clicado: 0
        })
	}
    onClickMedicoList = () => {
        alert('oiii');
        //this.props.setCurrent(this.props.currentMedico)
        this.setState({
            clicado: 1
        })
    }    

    render() {
        return (
            <a className="btn btn-primary text-left" href="#" onClick={this.onClickMedicoList('teste')}>Editar</a>
        )
    }
}
var urlEditar = '';
export default itemclicked;