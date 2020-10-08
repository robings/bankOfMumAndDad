import React, { useState } from "react";
import { toast } from "react-toastify";
import "./transactionsNewForm.css";

function TransactionsNewForm(props) {
  const [newTransactionFormInput, setNewTransactionFormInput] = useState( {type: "deposit"} );

  const handleInputChange = (e) => {
    if (e.currentTarget.value && e.currentTarget.className === "redBorder") {
      e.currentTarget.style.borderColor = "#999999";
    } else if (e.currentTarget.className === "redBorder") {
      e.currentTarget.style.borderColor = "#FF0000";
    }

    setNewTransactionFormInput({
      ...newTransactionFormInput,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  // const dateNow = new Date().toISOString().substr(0, 10);

  function handleSubmit(event) {
    event.preventDefault();
    if (
      !newTransactionFormInput.amount ||
      !newTransactionFormInput.dateOfTransaction ||
      !newTransactionFormInput.type === "deposit" ||
      !newTransactionFormInput.type === "withdrawal"
    ) {
      toast.error("Please fill in missing data");
    } else {
      submitNewTransaction(newTransactionFormInput);
    }
  }

  async function submitNewTransaction(newTransactionFormInput) {
    console.log (newTransactionFormInput.type)
    
    const data = {
      amount: newTransactionFormInput.amount,
      date: newTransactionFormInput.dateOfTransaction,
      type: newTransactionFormInput.type === "deposit" ? "0" : "1",
      comments: newTransactionFormInput.comments,
      accountId: props.accountId,
    };

    const response = await fetch("https://localhost:55741/api/Transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const json = await response.json();

    if (json.success === true) {
      toast.success("Transaction recorded");
      setTimeout(props.closeModal, 5000);
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
