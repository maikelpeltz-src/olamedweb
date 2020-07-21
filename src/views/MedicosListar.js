import React from 'react';
import ReactDOM from 'react-dom'
import { Row, Col, Card, Table, Button, Alert } from 'react-bootstrap';
import './css/lista_medicos.css';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Aux from "../hoc/_Aux";
import { medicosLista, medicoSetAtual, medicoSetAtivo, validarUsuario } from '../actions/';
import $ from 'jquery';
import ButtonGrid from '../components/buttonGrid';

window.jQuery = $;
window.$ = $;
global.jQuery = $;



$.DataTable = require('datatables.net-bs');
require('jszip');
require('pdfmake/build/pdfmake.js');
require('pdfmake/build/vfs_fonts.js');
require('datatables.net-autofill');
require('datatables.net-buttons-bs');
require('datatables.net-buttons/js/buttons.colVis.js');
require('datatables.net-buttons/js/buttons.flash.js');
require('datatables.net-buttons/js/buttons.html5.js');
require('datatables.net-buttons/js/buttons.print.js');
require('datatables.net-colreorder');
require('datatables.net-keytable');
require('datatables.net-responsive-bs');
require('datatables.net-rowgroup');
require('datatables.net-rowreorder');
require('datatables.net-scroller');
require('datatables.net-select');
require('datatables.net-fixedcolumns');
require('datatables.net-fixedheader');



var loaded = 0; //verificacao se Datatable já carregou!
var buttonTable = ''; // para limpar a table, precisamos armazena-la fora do contexto. Datatable, deve-se chamar de detroy,, 
var table = ''; // para limpar a table, precisamos armazena-la fora do contexto. Datatable, deve-se chamar de detroy,, 

class MedicosListar extends React.Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        loaded = 0;
        this.state = {
            editar: 0
        };
    };

    componentDidMount() {
        this.props.medicosLista();
        var this_ = this;
        loaded = 0;        
    }

    componentDidUpdate() {
        this.createButtonOnDiv();
    }

    //###########################################################################################
    // Responsável por atualizar o medico do state e mudar para tela de edição do medico!
    //###########################################################################################
    onClickMedicoList(idMedico, editar) {
        if (editar == 0) //cadastrar um medico novo!
        {
            this.props.medicoSetAtual(null);
            localStorage.setItem('medico_editar', '');
        }
        else if (editar == 1) // editar um medico
        {
            this.props.medicoSetAtual(idMedico);
            localStorage.setItem('medico_editar', idMedico);

            this.setState({
                editar: 1
            });
        }
    }
    
    createButtonOnDiv() {
        //Funcao para entrar em modo edição, mudar o estado vai redirecionar pra tela de crud!
        const func = this.props.medicoSetAtivo;
        const medicoList = (idMedico, i) => {
            this.props.medicoSetAtual(idMedico);
            localStorage.setItem('medico_editar', idMedico);
            this.setState({
                editar: 1
            });
        }

        var divsButtons = document.getElementsByClassName("myBtn");
        var i;
        for (i = 0; i < divsButtons.length; i++) {
            let idDiv = divsButtons[i].id;
            var dateParts = divsButtons[i].id.split("|");
            let idMedico = dateParts[0].trim();
            let ativoMedico = dateParts[1].trim();
            const element = (
                <div>
                    <button className="btn btn-primary text-center btn-editar" onClick={(e) => medicoList(idMedico, 1)}>{"\u00a0"} {"\u00a0"} Editar {"\u00a0"} {"\u00a0"} </button>
                    <ButtonGrid function={func}
                        id={idMedico}
                        ativo={ativoMedico} />
                </div>

            );
            ReactDOM.render(element, divsButtons[i])
        }
    }
    

    
    addEvent(){
        $('#data-table-responsive').on( 'draw.dt', () => {
            this.createButtonOnDiv();
        })
    }

    //#####################################################################
    //######## Cria e carrega a DataTable #################################
    //#####################################################################
    atable() {

        if (loaded > 0) {
            return;  //SE JÁ CARREGOU,, NAO CARREGA NOVAMENTE! SENAO DA PAU!
        }
        loaded++;

        let tableZero = '#data-table-zero';
        $.fn.dataTable.ext.errMode = 'throw';
        $(tableZero).DataTable({
            data: this.props.medicos,
            order: [[0, "asc"]],
            columns: [
                { "data": "nome", render: function (data, type, row) { return data; } },
                { "data": "crm", render: function (data, type, row) { return data; } },
                { "data": "email", render: function (data, type, row) { return data; } },
                {
                    "data": "acoes", render: function (data, type, row) {
                        return '<button>...</button>';
                    }
                }
            ]
        });

        let tableButton = '#datatable-button';
        let tableBtns = [
            {
                text: 'Clear Filters',
                className: "clr-filters-btn btn btn-danger",
                action: function (e, dt, node, config) {
                    // make function clear all text inputs on page via jquery
                    clearfilter()
                }
            },
            {
                extend: 'copyHtml5',
                text: 'Copy',
                className: "btn btn-secondary"
            },
            {
                extend: 'csvHtml5',
                text: 'CSV',
                className: "btn btn-secondary"
            },
            {
                extend: 'print',
                text: 'Print',
                className: "btn btn-secondary"
            }
        ];

        buttonTable = $(tableButton).DataTable({
            dom: 'Bfrti',
            data: this.props.medicos,
            order: [[0, "asc"]],
            columns: [

                { "data": "nome", render: function (data, type, row) { return data; } },
                { "data": "crm", render: function (data, type, row) { return data; } },
                { "data": "email", render: function (data, type, row) { return data; } },
                {
                    "data": "ações", render: function (data, type, row) {
                        return data;
                    }
                }
            ],
            buttons: tableBtns,
        });


        function clearfilter() {
            $('.search-it').find('input:text').val('');
            buttonTable
                .search('')
                .columns().search('')
                .draw();
        }

        let tableResponsive = '#data-table-responsive';

        table = $(tableResponsive).DataTable({

            data: this.props.medicos,
            order: [[0, "asc"]],
            columns: [
                { "data": "nome", render: function (data, type, row) { return data; } },
                { "data": "crm", render: function (data, type, row) { return data; } },
                { "data": "email", render: function (data, type, row) { return data; } },
                {

                    data: null,
                    render: function (data, type, row) {
                        // AQUI COLOCAMOS UM DIV, PARA SER SUBSTITUIDA POR BOTOES NO METODO createButtonOnDiv()
                        return `<div id="${data.id} ${'|'} ${data.ativo}" class="myBtn"/> </div>`;
                    }

                }
            ],
            responsive: {
                responsive: {
                    details: {
                        display: $.fn.dataTable.Responsive.display.childRowImmediate,
                        type: ''
                    }
                }
            }
        });



    }

  
    carregarTable(){
        if(this.props.medicos[0] === undefined){
            // do nothing
        } else{
            this.atable()
        }
    }

    carregarEvents(){
        if(this.props.medicos[0] === undefined) {
            // do nothing
        }
        else{
            this.addEvent();
        }
    }

    verificarPermissao(){
        if(validarUsuario() == false){
            return <Redirect to="/login" />
        }else{
            return null;
        }
    }

    verificarRedirectCrud(){
        if (this.state.editar > 0) {
            return <Redirect to="medicos/cadastrar" />;
        } else {
            return this.null;
        }
    }

    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card.Header>
                            {this.verificarPermissao()}
                            {this.verificarRedirectCrud()}
                            {this.carregarTable()}
                            {this.carregarEvents()}
                            <Button className="btn btn-success btn-cadastrar" href='/medicos/cadastrar' onClick={(e) => this.onClickMedicoList(e, 0)}> Cadastrar </Button>
                            <Card.Title as="h5">
                                Médicos
                            </Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Table ref="tbl" striped hover responsive className="table table-condensed" id="data-table-responsive">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>CRM</th>
                                        <th>E-mail</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tfoot>
                                    <tr>
                                        <th>Nome</th>
                                        <th>CRM</th>
                                        <th>E-mail</th>
                                        <th>Ações</th>
                                    </tr>
                                </tfoot>
                            </Table>
                        </Card.Body>
                    </Col>
                </Row>
            </Aux>
        );
    }
}

function mapStateToProps(state) {
    return {
        medicos: state.medicos,
    }
}

export default connect(mapStateToProps, { medicosLista, medicoSetAtual, medicoSetAtivo })(MedicosListar);