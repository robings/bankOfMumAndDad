import React, { useState, useEffect } from 'react';
import Loader from '../Loader/Loader';
import './transactions.css';


function Transactions(props) {
    const [accountId] = useState(props.accountData.id)
    const [firstName] = useState(props.accountData.firstName);
    const [lastName] = useState(props.accountData.lastName);
    const [startBalance] = useState(props.accountData.openingBalance);
    const [currentBalance] = useState(props.accountData.currentBalance);
    const [dataToDisplay, setDataToDisplay] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function getTransactions(acId) {
      const url = `https://localhost:55741/api/Transaction/${acId.toString()}`
        const response = await fetch(url);
        const json = await response.json();
        const processedData = await processData(json.data);

        setDataToDisplay(processedData);
        if (json.success === false) {
          setError(json.message);
        }
        setLoading(false);
    }

    function mount() {
        getTransactions(accountId);
    }

    function processData(dataToConvert) {
        let runningTotal = startBalance;
        let convertedData = dataToConvert;
        convertedData.forEach(transaction => {
            transaction.balance = transaction.type === 0 ? runningTotal + transaction.amount : runningTotal - transaction.amount;
            runningTotal = transaction.balance;
            transaction.date = transaction.date.split("T")[0].trim();
        })
        return convertedData;
    }

    useEffect(mount, []);

    return (
      <main>
        <h2>Transactions</h2>
        <h3>
          Name: {firstName} {lastName}{" "}
        </h3>
        {loading ? (
          <Loader />
        ) : (
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
                <td>£{startBalance}</td>
                <td></td>
              </tr>
              {dataToDisplay.map(
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
                <td>£{currentBalance}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        )}
        {error ? <div className="error">Opps {error}</div> : <div></div>}
      </main>
    );
}

export default Transactions;