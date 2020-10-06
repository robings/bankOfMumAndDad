import React, { useState, useEffect } from "react";
import Loader from '../Loader/Loader';
import { toast } from "react-toastify";
import './transactions.css';

function Transactions(props) {
  const [dataToDisplay, setDataToDisplay] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(false);
  
  function processData(accountDataToConvert, dataToConvert) {
    let runningTotal = accountDataToConvert.openingBalance;
    let convertedTransactions = dataToConvert;
    convertedTransactions.forEach((transaction) => {
      transaction.balance =
        transaction.type === 0
          ? runningTotal + transaction.amount
          : runningTotal - transaction.amount;
      runningTotal = transaction.balance;
      transaction.date = transaction.date.split("T")[0].trim();
    });
    let convertedData = {
      firstName: accountDataToConvert.firstName,
      lastName: accountDataToConvert.lastName,
      openingBalance: accountDataToConvert.openingBalance,
      currentBalance: accountDataToConvert.currentBalance,
      transactions: convertedTransactions,
    };;
    return convertedData;
  }

  useEffect(() => {
    async function fetchData(acId) {
      const accountUrl = `https://localhost:55741/api/Account/${acId.toString()}`;
      const accountResponse = await fetch(accountUrl);
      const accountJson = await accountResponse.json();

      const url = `https://localhost:55741/api/Transaction/${acId.toString()}`;
      const response = await fetch(url);
      const json = await response.json();

      if (
        accountJson.success === false ||
        (json.success === false &&
          json.message !== "No transactions found for account.")
      ) {
        toast.error("Account information not found");
        setErrors(true);
      }

      if (
        json.success === false &&
        json.message === "No transactions found for account."
      ) {
        toast.info(json.message);
        setErrors(true)
      }

      if (accountJson.success && json.success) {
        const processedData = await processData(accountJson.data[0], json.data);
        setDataToDisplay(processedData);
      }

      setLoading(false);
    }
    fetchData(props.accountId)
  }, [props.accountId]);

  return (
    <main>
      <h2>Transactions</h2>
      {loading ? (
        <Loader />
      ) : errors ? <div>No transactions to display</div> : (
        <div>
              <h3>
                Name: {dataToDisplay.firstName} {dataToDisplay.lastName}
              </h3>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Balance</th>
                    <th>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Start Balance</td>
                    <td></td>
                    <td></td>
                    <td>£{dataToDisplay.openingBalance}</td>
                    <td></td>
                  </tr>
                  {dataToDisplay.transactions.map(
                    ({ id, amount, date, type, comments, balance }) => (
                      <tr key={id}>
                        <td>{date}</td>
                        <td>{type === 0 ? "Deposit" : "Withdrawal"}</td>
                        <td>£{amount}</td>
                        <td>£{balance}</td>
                        <td>{comments}</td>
                      </tr>
                    )
                  )}
                  <tr>
                    <td>End Balance</td>
                    <td></td>
                    <td></td>
                    <td>£{dataToDisplay.currentBalance}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
        </div>
      )}
    </main>
  );
}

export default Transactions;
