import React, { useState } from 'react';
import './AccountsNewForm.css';

function AccountsNewForm(props) {
    const [newAccountFormInput, setNewAccountFormInput] = useState([{}]);

    const handleInputChange = (e) => {
        if (e.currentTarget.value && e.currentTarget.className === 'redBorder') {
            e.currentTarget.style.borderColor = "#999999";
        } else if (e.currentTarget.className === 'redBorder') {
            e.currentTarget.style.borderColor = "#FF0000";
        }
        setNewAccountFormInput({
            ...newAccountFormInput,
            [e.currentTarget.name]: e.currentTarget.value
        })
    };

    function handleSubmit(event) {
        event.preventDefault();
        if (!newAccountFormInput.firstName || !newAccountFormInput.lastName || !newAccountFormInput.openingBalance) {
            alert("Please fill in missing data");
        }
        alert(`You clicked submit ${newAccountFormInput.firstName} ${newAccountFormInput.lastName}!`);
    }

    return (
        <div className="overlay">
            <div className="modal">
                <h1>New Account</h1>
                <form>
                    <div>
                        <label>First Name</label><input class="redBorder" type="text" name="firstName" onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Last Name</label><input class="redBorder" type="text" name="lastName" onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Opening Balance £</label><input class="redBorder" type="number" name="openingBalance" onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Current Balance<superscript>*</superscript> £</label><input type="number" name="currentBalance" onChange={handleInputChange} />
                    </div>
                    <label><superscript>*</superscript>(if different from opening balance)</label>
                </form>
                <button onClick={handleSubmit}>Submit</button>
                <button className="closeButton" onClick={props.closeModal}>X</button>
            </div>
        </div>
    )
}

export default AccountsNewForm;
