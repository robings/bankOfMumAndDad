import React, { useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
            toast.error("Please fill in missing data");
        } else {
            submitNewAccount(newAccountFormInput);
        }
    }

    async function submitNewAccount(newAccountFormInput) {
        if (!newAccountFormInput.currentBalance) {
            newAccountFormInput.currentBalance = newAccountFormInput.openingBalance;
        }

        const data = {
            'firstName': newAccountFormInput.firstName,
            'lastName' : newAccountFormInput.lastName,
            'openingBalance': newAccountFormInput.openingBalance,
            'currentBalance': newAccountFormInput.currentBalance
        }

        const response = await fetch('https://localhost:55741/api/Account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const json = await response.json();

        if (json.success === true) {
            toast.success('Account Created');
            setTimeout(props.closeModal, 5000);
        } else {
            toast.error(json.message)
        }
    }

    return (
      <div className="overlay">
        <div className="modal">
            <button className="closeButton" onClick={props.closeModal}>
            X
            </button>
            <h1>New Account</h1>
            <form>
                <div>
                <label>First Name</label>
                <input
                    className="redBorder"
                    type="text"
                    name="firstName"
                    onChange={handleInputChange}
                />
                </div>
                <div>
                <label>Last Name</label>
                <input
                    className="redBorder"
                    type="text"
                    name="lastName"
                    onChange={handleInputChange}
                />
                </div>
                <div>
                <label>Opening Balance £</label>
                <input
                    className="redBorder"
                    type="number"
                    name="openingBalance"
                    onChange={handleInputChange}
                />
                </div>
                <div>
                <label>
                    Current Balance £
                </label>
                <input
                    type="number"
                    name="currentBalance"
                    onChange={handleInputChange}
                />
                </div>
                <label>
                (if different from opening balance)
                </label>
            </form>
            <button onClick={handleSubmit}>Submit</button>
            <ToastContainer />
            </div>
        </div>
    );
}

export default AccountsNewForm;