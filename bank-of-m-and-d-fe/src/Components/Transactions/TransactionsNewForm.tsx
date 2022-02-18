import React, { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import apiTransactions from "../../api/apiTransactions";
import appStrings from "../../constants/app.strings";
import { ITransactionDto } from "../../Interfaces/Entities/ITransactionDto";
import { MessageStatus } from "../../Interfaces/IMessage";
import {
  INewTransactionFormInput,
  INewTransactionFormProps,
} from "../../Interfaces/INewTransactionForm";
import { revokeToken } from "../../tokenHelper/tokenHelper";

function TransactionsNewForm(props: INewTransactionFormProps): JSX.Element {
  const [newTransactionFormInput, setNewTransactionFormInput] =
    useState<INewTransactionFormInput>({
      amount: null,
      dateOfTransaction: null,
      type: "DEPOSIT",
      comments: "",
    });

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (e.currentTarget.value && e.currentTarget.className === "redBorder") {
      e.currentTarget.style.borderColor = "#107C10";
    } else if (e.currentTarget.className === "redBorder") {
      e.currentTarget.style.borderColor = "#E81123";
    }

    setNewTransactionFormInput({
      ...newTransactionFormInput,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (
      !newTransactionFormInput.amount ||
      !newTransactionFormInput.dateOfTransaction
    ) {
      toast.error(appStrings.missingInfoError);
    } else {
      submitNewTransaction(newTransactionFormInput);
    }
  }

  async function submitNewTransaction(
    newTransactionFormInput: INewTransactionFormInput
  ): Promise<void> {
    const data: ITransactionDto = {
      amount: newTransactionFormInput.amount!,
      date: newTransactionFormInput.dateOfTransaction!,
      type: newTransactionFormInput.type === "DEPOSIT" ? "0" : "1",
      comments: newTransactionFormInput.comments,
      accountId: props.accountId,
    };

    try {
      await apiTransactions.saveNewTransaction(data);

      props.setTransactionsMessage({
        status: MessageStatus.success,
        message: appStrings.transactions.newForm.success,
      });
      props.closeModal();
    } catch {
      props.setTransactionsMessage({
        status: MessageStatus.error,
        message: appStrings.notLoggedIn,
      });
      revokeToken();
      props.closeModal();
    }
  }

  return (
    <div className="overlay">
      <div className="modal">
        <button className="appButton closeButton" onClick={props.closeModal}>
          {appStrings.closeButton}
        </button>
        <h1>{appStrings.transactions.newForm.title}</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>{appStrings.transactions.newForm.amount}</label>
            <input
              className="redBorder"
              type="number"
              name="amount"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>{appStrings.transactions.newForm.date}</label>
            <input
              className="redBorder"
              type="date"
              name="dateOfTransaction"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>{appStrings.transactions.newForm.type}</label>

            <select name="type" onChange={handleInputChange}>
              <option value="deposit">
                {appStrings.transactions.newForm.typeOptions.deposit}
              </option>
              <option value="withdrawal">
                {appStrings.transactions.newForm.typeOptions.withdrawal}
              </option>
            </select>
          </div>
          <div>
            <label>{appStrings.transactions.newForm.comments}</label>
            <input
              className="redBorder"
              type="text"
              name="comments"
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

export default TransactionsNewForm;
