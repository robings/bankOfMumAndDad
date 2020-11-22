import React, { useState, useEffect } from 'react';
import Loader from '../Loader/Loader';
import { toast } from 'react-toastify';
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
      transaction.date = transaction.date.split('T')[0].trim();
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
      const tokenFromStorage = localStorage.getItem('bearerToken');
      const token = `Bearer ${tokenFromStorage}`;

      const accountUrl = `https://localhost:55741/api/Account/${acId.toString()}`;
      const accountResponse = await fetch(accountUrl, {
        headers: {
            'Authorization': token,
        }
      });

      if (accountResponse.status === 401) {
        toast.error('You are not logged in.');
        setErrors(true);
        setLoading(false);
        return;
      }
      const accountJson = await accountResponse.json();

      const url = `https://localhost:55741/api/Transaction/${acId.toString()}`;
      const response = await fetch(url, {
        headers: {
            'Authorization': token,
        }
      });

      if (response.status === 401) {
        toast.error('You are not logged in.');
        setErrors(true);
        setLoading(false);
        return;
      }

      const json = await response.json();

      if (
        accountJson.success === false ||
        (json.success === false &&
          json.message !== 'No transactions found for account.')
      ) {
        toast.error('Account information not found');
        setErrors(true);
      }

      if (
        json.success === false &&
        json.message === 'No transactions found for account.'
      ) {
        toast.info(json.message);
        setErrors(true)
      }

      if (accountJson.success && json.success) {
        const processedData = await processData(accountJson.data[0], json.data);
        setDataToDisplay(processedData);
      } else if (accountJson.success && !json.success) {
        setDataToDisplay(accountJson.data[0])
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
      ) : !errors &&
        <div>
              <h3>
                Name: {dataToDisplay.firstName} {dataToDisplay.lastName}
              </h3>
              
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th style={{ textAlign: "center" }}>Deposits</th>
                    <th style={{ textAlign: "center" }}>Withdrawals</th>
                    <th style={{ textAlign: "center" }}>Balance</th>
                    <th>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Start Balance</td>
                    <td></td>
                    <td></td>
                    {dataToDisplay.openingBalance < 0 ? (
                    <td style={{ textAlign: "right", color: "#FF0000" }}>
                      -£{(dataToDisplay.openingBalance * -1).toFixed(2)}
                    </td>
                    ) : (
                    <td style={{ textAlign: "right", color: "#009900" }}>
                      £{dataToDisplay.openingBalance.toFixed(2)}
                    </td>
                    )}
                    <td></td>
                  </tr>
                  {errors ? <tr><td colSpan="5">No transactions to display</td></tr> : (
                  dataToDisplay.transactions.map(
                    ({ id, amount, date, type, comments, balance }) => (
                      <tr key={id}>
                        <td style={{width: "15%"}}>{date}</td>
                        <td style = {{textAlign: "right", color: "#009900", width: "150px"}}>{type === 0 ? `£${amount.toFixed(2)}` : ""}</td>
                        <td style = {{textAlign: "right", color: "#FF0000", width: "150px"}}>{type === 0 ? "" : `£${amount.toFixed(2)}`}</td>
                        {balance < 0 ? (
                        <td style={{ textAlign: "right", color: "#FF0000", width: "150px" }}>
                          -£{(balance * -1).toFixed(2)}
                        </td>
                        ) : (
                        <td style={{ textAlign: "right", color: "#009900", width: "150px" }}>
                          £{balance.toFixed(2)}
                        </td>
                        )}
                        <td style = {{textAlign: "left"}}>{comments}</td>
                      </tr>
                    )
                  )
                  )}
                  <tr>
                    <td>End Balance</td>
                    <td></td>
                    <td></td>
                    {dataToDisplay.currentBalance < 0 ? (
                    <td style={{ textAlign: "right", color: "#FF0000" }}>
                      -£{(dataToDisplay.currentBalance * -1).toFixed(2)}
                    </td>
                    ) : (
                    <td style={{ textAlign: "right", color: "#009900" }}>
                      £{dataToDisplay.currentBalance.toFixed(2)}
                    </td>
                    )}
                    <td></td>
                  </tr>
                </tbody>
              </table>
        </div>
      }
    </main>
  );
}

export default Transactions;
