import React from 'react';
import './AccountsNewForm.css';

function AccountsNewForm(props) {
    return (
        <div className="overlay">
            <div className="modal">
                <h1>New Account</h1>
                <button className="closeButton" onClick={props.closeModal}>X</button>
            </div>
        </div>
    )
}

export default AccountsNewForm;
