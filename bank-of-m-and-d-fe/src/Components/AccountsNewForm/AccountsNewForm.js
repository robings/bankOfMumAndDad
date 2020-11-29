import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AccountsNewForm.css';
import { PostNewAccount } from '../../ApiService/ApiServiceAccounts';

function AccountsNewForm(props) {
    const [newAccountFormInput, setNewAccountFormInput] = useState([{}]);

    const handleInputChange = (e) => {
        if (e.currentTarget.value && e.currentTarget.className === 'redBorder') {
            e.currentTarget.style.borderColor = '#999999';
        } else if (e.currentTarget.className === 'redBorder') {
            e.currentTarget.style.borderColor = 'FF0000';
        }
        setNewAccountFormInput({
            ...newAccountFormInput,
            [e.currentTarget.name]: e.currentTarget.value
        })
    };

    function handleSubmit(event) {
        event.preventDefault();
        if (!newAccountFormInput.firstName || !newAccountFormInput.lastName || !newAccountFormInput.openingBalance) {
            toast.error('Please fill in missing data');
        } else {
            submitNewAccount(newAccountFormInput);
        }
    }

    async function submitNewAccount(newAccountFormInput) {
        const data = {
            'firstName': newAccountFormInput.firstName,
            'lastName' : newAccountFormInput.lastName,
            'openingBalance': newAccountFormInput.openingBalance,
            'currentBalance': newAccountFormInput.openingBalance
        }

        const response = await PostNewAccount(data);

        if (response.status === 401) {
          props.setAccountsMessage({ status: 'error', message: 'You are not logged in' });
            props.closeModal();
          return;
        }
        
        const json = await response.json();

        if (json.success === true) {
            props.setAccountsMessage({ status: 'success', message: 'Account Created' });
            props.closeModal();
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
          </form>
          <button
         
         
                onClick={handleSubmit}
      
      
                      style={{ marginTop: "10px" }}
          
          
          >
            Submit
          </button>
        </div>
      </div>
    );
}

export default AccountsNewForm;
