import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { PostNewTransaction } from '../../ApiService/ApiServiceTransactions';
import { RevokeToken } from '../../TokenService/TokenService';
import './transactionsNewForm.css';

function TransactionsNewForm(props) {
  const [newTransactionFormInput, setNewTransactionFormInput] = useState( {type: 'deposit'} );

  const handleInputChange = (e) => {
    if (e.currentTarget.value && e.currentTarget.className === 'redBorder') {
      e.currentTarget.style.borderColor = '#999999';
    } else if (e.currentTarget.className === 'redBorder') {
      e.currentTarget.style.borderColor = '#FF0000';
    }

    setNewTransactionFormInput({
      ...newTransactionFormInput,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  function handleSubmit(event) {
    event.preventDefault();
    if (
      !newTransactionFormInput.amount ||
      !newTransactionFormInput.dateOfTransaction ||
      !newTransactionFormInput.type === 'deposit' ||
      !newTransactionFormInput.type === 'withdrawal'
    ) {
      toast.error('Please fill in missing data');
    } else {
      submitNewTransaction(newTransactionFormInput);
    }
  }

  async function submitNewTransaction(newTransactionFormInput) {
    const data = {
      amount: newTransactionFormInput.amount,
      date: newTransactionFormInput.dateOfTransaction,
      type: newTransactionFormInput.type === 'deposit' ? '0' : '1',
      comments: newTransactionFormInput.comments,
      accountId: props.accountId,
    };

    const response = await PostNewTransaction(data);

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
        <form>
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
            <input type="text" name="comments" onChange={handleInputChange} />
          </div>
        </form>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}

export default TransactionsNewForm;
