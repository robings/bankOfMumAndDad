import React, { useState } from 'react';
import AccountsNewForm from '../AccountsNewForm/AccountsNewForm'
import './AccountsNav.css';

function AccountsNav(props) {
    const [newAccountModalVisiblity, setNewAccountModalVisiblity] = useState(false);

    return (
        <div className="subNav">
            <button className="subNavButton" onClick={() => setNewAccountModalVisiblity(true)}>New Account</button>
            {newAccountModalVisiblity && <AccountsNewForm newAccountModalVisibility={newAccountModalVisiblity} closeModal={() => setNewAccountModalVisiblity(false)} />}
        </div>
    )
}

export default AccountsNav;
