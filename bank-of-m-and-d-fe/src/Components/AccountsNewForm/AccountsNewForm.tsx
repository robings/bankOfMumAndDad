import React, { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AccountsNewForm.css';
import apiAccounts from "../../api/apiAccounts";
import {
  INewAccountFormInput,
  INewAccountFormProps,
} from "../../Interfaces/INewAccountForm";
import { IResponse } from "../../Interfaces/Entities/IResponse";
import { IAccount } from "../../Interfaces/Entities/IAccount";
import { MessageStatus } from "../../Interfaces/IMessage";
import appStrings from "../../constants/app.strings";

function AccountsNewForm(props: INewAccountFormProps): JSX.Element {
  const [newAccountFormInput, setNewAccountFormInput] =
    useState<INewAccountFormInput>({
      firstName: "",
      lastName: "",
      openingBalance: null,
    });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.value && e.currentTarget.className === "redBorder") {
      e.currentTarget.style.borderColor = "#107C10";
    } else if (e.currentTarget.className === "redBorder") {
      e.currentTarget.style.borderColor = "#E81123";
    }
    setNewAccountFormInput({
      ...newAccountFormInput,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (
      !newAccountFormInput.firstName ||
      !newAccountFormInput.lastName ||
      !newAccountFormInput.openingBalance
    ) {
      toast.error(appStrings.missingInfoError);
    } else {
      submitNewAccount(newAccountFormInput);
    }
  }

  async function submitNewAccount(newAccountFormInput: INewAccountFormInput) {
    const data: any = {
      firstName: newAccountFormInput.firstName,
      lastName: newAccountFormInput.lastName,
      openingBalance: newAccountFormInput.openingBalance,
      currentBalance: newAccountFormInput.openingBalance,
    };

    const response: Response = await apiAccounts.saveNewAccount(data);

    if (response.status === 401) {
      props.setAccountsMessage({
        status: MessageStatus.error,
        message: appStrings.notLoggedIn,
      });
      props.closeModal();
      return;
    }

    const json: IResponse<IAccount> = await response.json();

    if (json.success === true) {
      props.setAccountsMessage({
        status: MessageStatus.success,
        message: appStrings.accounts.newForm.success,
      });
      props.closeModal();
    } else {
      toast.error(json.message);
    }
  }

  return (
    <div className="overlay">
      <div className="modal">
        <button className="appButton closeButton" onClick={props.closeModal}>
          {appStrings.closeButton}
        </button>
        <h1>{appStrings.accounts.newForm.title}</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>{appStrings.accounts.newForm.firstName}</label>
            <input
              className="redBorder"
              type="text"
              name="firstName"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>{appStrings.accounts.newForm.lastName}</label>
            <input
              className="redBorder"
              type="text"
              name="lastName"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>{appStrings.accounts.newForm.openingBalance}</label>
            <input
              className="redBorder"
              type="number"
              name="openingBalance"
              onChange={handleInputChange}
            />
          </div>
          <input
            className="appButton"
            type="submit"
            value={appStrings.submit}
          />
        </form>
      </div>
    </div>
  );
}

export default AccountsNewForm;
