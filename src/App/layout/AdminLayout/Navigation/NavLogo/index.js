import React from 'react';
import DEMO from './../../../../../store/constant';
import Aux from "../../../../../hoc/_Aux";
import Logo  from '../../../../../assets/images/icon.png'

const navLogo = (props) => {
    let toggleClass = ['mobile-menu'];
    if (props.collapseMenu) {
        toggleClass = [...toggleClass, 'on'];
    }

    return (
        <Aux>
            <div className="navbar-brand header-logo">
                <a href={DEMO.BLANK_LINK} className="b-brand" color = "white">
                    <div className="b-bg">
                        <img src={Logo} alt="Dynamic logo" height = "30px" width = "30px"/>
                    </div>
                    <span className="b-title">OláMed</span>
                </a>
                <a href={DEMO.BLANK_LINK} className={toggleClass.join(' ')} id="mobile-collapse" onClick={props.onToggleNavigation}><span /></a>
            </div>
        </Aux>
    );
};

export default navLogo;
