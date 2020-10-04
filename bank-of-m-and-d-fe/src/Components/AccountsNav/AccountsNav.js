import React from 'react';
import './AccountsNav.css';

function AccountsNav(props) {


    return (
        <div className="subNav">
            <button className="subNavButton" onClick={props.openModal}>New Account</button>
        </div>
    )
}

export default AccountsNav;
