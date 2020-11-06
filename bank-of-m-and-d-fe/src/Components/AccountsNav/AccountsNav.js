import React from 'react';
import './AccountsNav.css';

function AccountsNav(props) {


    return (
        <div>
            <div className="subNav">
                <button className="subNavButton" onClick={props.openLoginModal}>Login</button>
            </div>
            <div className="subNav">
                <button className="subNavButton" onClick={props.openNewAccountModal}>New Account</button>
            </div>
        </div>
    )
}

export default AccountsNav;
