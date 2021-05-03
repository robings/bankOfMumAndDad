import React, { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import { PostNewTransaction } from '../../ApiService/ApiServiceTransactions';
import { ITransactionDto } from '../../Interfaces/Entities/ITransactionDto';
import { INewTransactionFormInput, INewTransactionFormProps } from '../../Interfaces/INewTransactionForm';
import { RevokeToken } from '../../TokenService/TokenService';

function TransactionsNewForm(props: INewTransactionFormProps): JSX.Element {
  const [newTransactionFormInput, setNewTransactionFormInput] = useState<INewTransactionFormInput>( { amount: null, dateOfTransaction: null, type: 'DEPOSIT', comments: '' } );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    if (e.currentTarget.value && e.currentTarget.className === 'redBorder') {
      e.currentTarget.style.borderColor = '#107C10';
    } else if (e.currentTarget.className === 'redBorder') {
      e.currentTarget.style.borderColor = '#E81123';
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
      toast.error('Please fill in missing data');
    } else {
      submitNewTransaction(newTransactionFormInput);
    }
  }

  async function submitNewTransaction(newTransactionFormInput: INewTransactionFormInput): Promise<void> {
    const data: ITransactionDto  = {
      amount: newTransactionFormInput.amount!,
      date: newTransactionFormInput.dateOfTransaction!,
      type: newTransactionFormInput.type === 'DEPOSIT' ? '0' : '1',
      comments: newTransactionFormInput.comments,
      accountId: props.accountId,
    };

    const response: Response = await PostNewTransaction(data);

    if (response.status === 401) {
      props.setTransactionsMessage({ status: 'error', message: 'You are not logged in' });
      RevokeToken();
      props.closeModal();
      return;
    }

    const json = await response.json();

    if (json.success === true) {
      props.setTransactionsMessage({ status: 'success', message: 'Transaction recorded' });
      props.closeModal();
    } else {
      toast.error(json.message);
    }
  }

  return (
    <div className="overlay">
      <div className="modal">
        <button className="closeButton" onClick={props.closeModal}>
          X
        </button>
        <h1>New Transaction</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Amount £</label>
            <input
              className="redBorder"
              type="number"
              name="amount"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Date of transaction</label>
            <input
              className="redBorder"
              type="date"
              name="dateOfTransaction"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Type</label>

            <select
              name="type"
              onChange={handleInputChange}
            >
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
            </select>
          </div>
          <div>
            <label>Comments</label>
            <input
              className="redBorder"
              type="text" 
              name="comments" 
              onChange={handleInputChange} />
          </div>
          <input type="submit" value="Submit" />
        </form>
      </div>
    </div>
  );
}

export default TransactionsNewForm;
