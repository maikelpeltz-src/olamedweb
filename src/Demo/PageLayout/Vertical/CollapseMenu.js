import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Col, Card, Table} from 'react-bootstrap';

import Aux from "../../../hoc/_Aux";
import * as actionTypes from "../../../store/actions";

class CollapseMenu extends Component {

    componentWillMount() {
        if (this.props.layout !== 'vertical') {
            this.props.onChangeLayout('vertical');
        }
        if (!this.props.collapseMenu) {
            this.props.onToggleNavigation();
        }
    }

    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title as='h5'>Collapse Menu Layout</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Card.Text>Open <code>config.ts</code> file from directory [ ../src/config.ts ] and edit <mark>highlighted</mark> options in this file.</Card.Text>
                                <Table bordered striped responsive>
                                    <thead className="header-table">
                                    <tr>
                                        <th>Configuration</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>
                                            <ul>
                                                <li><mark>layout: <code>vertical</code></mark></li>
                                                <li>preLayout: <code>null</code></li>
                                                <li><mark>collapseMenu: <code>true</code></mark></li>
                                                <li>layoutType: <code>menu-dark</code></li>
                                                <li>navIconColor: <code>false</code></li>
                                                <li>headerBackColor: <code>header-default</code></li>
                                                <li>navBackColor: <code>navbar-default</code></li>
                                                <li>navBrandColor: <code>brand-default</code></li>
                                                <li>navBackImage: <code>false</code></li>
                                                <li>rtlLayout: <code>false</code></li>
                                                <li>navFixedLayout: <code>true</code></li>
                                                <li>headerFixedLayout: <code>false</code></li>
                                                <li>boxLayout: <code>false</code></li>
                                                <li>navDropdownIcon: <code>style1</code></li>
                                                <li>navListIcon: <code>style1</code></li>
                                                <li>navActiveListColor: <code>active-default</code></li>
                                                <li>navListTitleColor: <code>title-default</code></li>
                                                <li>navListTitleHide: <code>false</code></li>
                                            </ul>
                                        </td>
                                    </tr>
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        layout: state.native.layout,
        collapseMenu: state.native.collapseMenu
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onChangeLayout: (layout) => dispatch({type: actionTypes.CHANGE_LAYOUT, layout: layout}),
        onToggleNavigation: () => dispatch({type: actionTypes.COLLAPSE_MENU})
    }
};

export default connect(mapStateToProps, mapDispatchToProps) (CollapseMenu);