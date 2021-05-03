import React, { useState, useEffect } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import Loader from '../Loader/Loader';
import { toast } from 'react-toastify';
import './transactions.css';
import { GetTransactionsByAccountId } from '../../ApiService/ApiServiceTransactions';
import { RevokeToken, LoggedIn } from '../../TokenService/TokenService';
import { ITransactionProps } from '../../Interfaces/Props/ITransactionsProps';
import { IListOfTransactionsForAccount, ITransaction } from '../../Interfaces/Entities/ITransaction'
import { IResponse } from '../../Interfaces/Entities/IResponse';

function Transactions(props: ITransactionProps): JSX.Element {
  const [dataToDisplay, setDataToDisplay] = useState<IListOfTransactionsForAccount>({
    accountId: null,
    firstName: '',
    lastName: '',
    openingBalance: 0,
    currentBalance: 0,
    transactions: [] 
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [errors, setErrors] = useState<boolean>(false);
  const [loggedIn] = useState<boolean>(LoggedIn);

  const history = useHistory<RouteComponentProps>();
  
  function processData(dataToConvert: IListOfTransactionsForAccount): IListOfTransactionsForAccount {
    const convertedTransactions: ITransaction[] = dataToConvert.transactions;
    
    convertedTransactions.forEach((transaction) => {
      transaction.date = transaction.date.split('T')[0].trim();
    });

    const convertedData: IListOfTransactionsForAccount = {
      accountId: dataToConvert.accountId,
      firstName: dataToConvert.firstName,
      lastName: dataToConvert.lastName,
      openingBalance: dataToConvert.openingBalance,
      currentBalance: dataToConvert.currentBalance,
      transactions: convertedTransactions,
    };
    return convertedData;
  }

  useEffect((): void => {
    async function fetchData(acId: string): Promise<void> {
      const response: Response = await GetTransactionsByAccountId(acId);

      if (response.status === 401) {
        toast.error('You are not logged in.');
        RevokeToken();
        setErrors(true);
        setLoading(false);
        setTimeout(redirectToLoginPage, 5000);
        return;
      }

      const json: IResponse<IListOfTransactionsForAccount> = await response.json();

      if (json.success === false && json.message !== 'No transactions found for account.') {
        toast.error('Account information not found');
        setErrors(true);
      }

      if (json.success === false && json.message === 'No transactions found for account.') {
        toast.info(json.message);
        setErrors(true)
      }

      if (json.success) {
        const processedData: IListOfTransactionsForAccount = processData(json.data);
        setDataToDisplay(processedData);
      }

      setLoading(false);
    }

    const redirectToLoginPage = (): void => {
      history.push('/')
    }

    if (loggedIn) {
      fetchData(props.accountId);
    }
  }, [props.accountId, loggedIn, history]);

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
                  {errors ? <tr><td colSpan={5}>No transactions to display</td></tr> : (
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
      }
    </main>
  );
}

export default Transactions;
