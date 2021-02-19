import React from 'react';

function AccountsNav(props) {
    return (
            <div className="subNav">
                {localStorage.getItem('bearerToken') && (<button className="subNavButton" onClick={props.openNewAccountModal}>New Account</button>)}
            </div>
    )
}

export default AccountsNav;
