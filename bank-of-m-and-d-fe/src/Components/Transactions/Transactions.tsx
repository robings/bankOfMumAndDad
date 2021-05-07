import React from 'react';
import './transactions.css';
import { ITransactionProps } from '../../Interfaces/Props/ITransactionsProps';
import Loader from '../Loader/Loader';

function Transactions(props: ITransactionProps): JSX.Element {
  const dataToDisplay = props.transactionsData;
  const error = props.transactionsError;
  const loading = props.transactionsLoading;

  return (
    <main>
      <h2>Transactions</h2>
      {loading  && !error ? (
          <Loader />
        ) : (
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
              {error ? <tr><td colSpan={5}>No transactions to display</td></tr> : (
              dataToDisplay.transactions.map(
                ({ amount, date, type, comments, balance }, index) => (
                  <tr key={index}>
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
      )}
    </main>
  );
}

export default Transactions;
