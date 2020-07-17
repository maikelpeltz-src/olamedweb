import React from 'react';
import '../views/css/lista_medicos.css';

class ButtonGrid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ativo: props.ativo
        }
    }
    componentDidMount() {
        this.setState({
            ativo: this.props.ativo
        })
    }
    
    onClick(){
        this.props.function(this.props.id, this.state.ativo == 1 ? 0 : 1)
        .then(result => {
            if(result == true)
            {
                if(this.state.ativo == 1){
                    this.setState({
                        ativo: 0
                    })
                }
                else{
                    this.setState({
                        ativo: 1
                    })
                }
            }
        }).catch(error => {
           
        });
    }
    
    render() {
        return (
            <>
                {this.state.ativo == 1 
                    ? 
                    <button className="btn btn-danger text-center btn-desabilitar"  onClick={(e) => this.onClick()}>Desabilitar</button>
                    :
                    <button className="btn btn-success text-center btn-habilitar"  onClick={(e) => this.onClick()}> {"\u00a0"} Habilitar {"\u00a0"}</button>
                }
            </>
        )
    }
}
export default ButtonGrid;