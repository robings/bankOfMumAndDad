import React, { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AccountsNewForm.css';
import { PostNewAccount } from '../../ApiService/ApiServiceAccounts';
import { INewAccountFormInput, INewAccountFormProps } from '../../Interfaces/INewAccountForm';
import { IResponse } from '../../Interfaces/Entities/IResponse';
import { IAccount } from '../../Interfaces/Entities/IAccount';

function AccountsNewForm(props: INewAccountFormProps): JSX.Element {
    const [newAccountFormInput, setNewAccountFormInput] = useState<INewAccountFormInput>({firstName: '', lastName: '', openingBalance: null});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.value && e.currentTarget.className === 'redBorder') {
            e.currentTarget.style.borderColor = '#107C10';
        } else if (e.currentTarget.className === 'redBorder') {
            e.currentTarget.style.borderColor = '#E81123';
        }
        setNewAccountFormInput({
            ...newAccountFormInput,
            [e.currentTarget.name]: e.currentTarget.value
        })
    };

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!newAccountFormInput.firstName || !newAccountFormInput.lastName || !newAccountFormInput.openingBalance) {
            toast.error('Please fill in missing data');
        } else {
            submitNewAccount(newAccountFormInput);
        }
    }

    async function submitNewAccount(newAccountFormInput: INewAccountFormInput) {
        const data: any = {
            'firstName': newAccountFormInput.firstName,
            'lastName' : newAccountFormInput.lastName,
            'openingBalance': newAccountFormInput.openingBalance,
            'currentBalance': newAccountFormInput.openingBalance
        }

        const response: Response = await PostNewAccount(data);

        if (response.status === 401) {
          props.setAccountsMessage({ status: 'error', message: 'You are not logged in' });
          props.closeModal();
          return;
        }
        
        const json: IResponse<IAccount> = await response.json();

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
          <form onSubmit={handleSubmit}>
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
            <input type="submit" value="Submit" />
          </form>
        </div>
      </div>
    );
}

export default AccountsNewForm;
