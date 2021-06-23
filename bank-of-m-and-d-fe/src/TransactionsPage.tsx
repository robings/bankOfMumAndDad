import React, { useState, useEffect } from 'react';
import Header from './Components/Header/Header';
import TransactionsNav from './Components/TranactionsNav/TransactionsNav';
import Transactions from './Components/Transactions/Transactions';
import TransactionsNewForm from './Components/TransactionsNewForm/TransactionsNewForm';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useHistory, RouteComponentProps } from 'react-router-dom';
import { RevokeToken, LoggedIn } from './TokenService/TokenService';
import { ITransactionsPageParams } from './Interfaces/Params/ITransactionsPageParams';
import { IMessage } from './Interfaces/IMessage';
import { GetTransactionsByAccountId } from './ApiService/ApiServiceTransactions';
import { IResponse } from './Interfaces/Entities/IResponse';
import { IListOfTransactionsForAccount, ITransaction } from './Interfaces/Entities/ITransaction';

function TransactionsPage(): JSX.Element {
  const { accountId }: ITransactionsPageParams = useParams();
  const history: any = useHistory<RouteComponentProps>();
  const [ newTransactionModalVisiblity, setNewTransactionModalVisiblity ] = useState<boolean>(false);
  const [ transactionsMessage, setTransactionsMessage ] = useState<IMessage | null>(null);
  const [ loggedIn ] = useState<boolean>(LoggedIn);
  const [ loading, setLoading ] = useState<boolean>(false);
  const [ errors, setErrors ] = useState<boolean>(false);
  const [ noTransactions, setNoTransactions ] = useState<boolean>(false);
  const [ transactionsData, setTransactionsData ] = useState<IListOfTransactionsForAccount>({
    accountId: null,
    firstName: '',
    lastName: '',
    openingBalance: 0,
    currentBalance: 0,
    transactions: [] 
  });

  const handleCloseModal = (): void => {
    setNewTransactionModalVisiblity(false);
  };

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

  useEffect ((): void => {
    const redirectToLoginPage = (): void => {
      history.push('/')
    }

    if (!loggedIn) {
      redirectToLoginPage();
    }

    async function getTransactionsByAccountId(acId: string): Promise<void> {
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
        setNoTransactions(true);
      }

      if (json.success) {
        const processedData: IListOfTransactionsForAccount = processData(json.data);
        setTransactionsData(processedData);
      }

      setLoading(false);
    }

    setLoading(true);
    getTransactionsByAccountId(accountId);

    if (transactionsMessage) {
      if (transactionsMessage.status === 'success'){
        toast.success(transactionsMessage.message);
        setErrors(false);
        setNoTransactions(false);
      }
      else if (transactionsMessage.status === 'error' && transactionsMessage.message === 'You are not logged in') {
        RevokeToken();
        toast.error('For your security, you have been logged out');
        setTimeout(redirectToLoginPage, 5000);
      }
      else if (transactionsMessage.status === 'error') {
        toast.error(transactionsMessage.message);
      }
    }
  }, [ transactionsMessage, history, loggedIn, accountId ])

  return (
    <div className="App">
      <Header isTransactionsPage = {true} />
      <TransactionsNav
        openNewTransactionModal={() => setNewTransactionModalVisiblity(true)}
      />
      <Transactions
        transactionsData = {transactionsData}
        transactionsError = {errors}
        noTransactions = {noTransactions}
        transactionsLoading = {loading}
        setTransactionsMessage = {setTransactionsMessage}
      />
      {newTransactionModalVisiblity && (
        <TransactionsNewForm
          setTransactionsMessage = {setTransactionsMessage}
          closeModal = {() => handleCloseModal()}
          accountId = {accountId}
        />
      )}
      <ToastContainer />
    </div>
  );
}

export default TransactionsPage;
