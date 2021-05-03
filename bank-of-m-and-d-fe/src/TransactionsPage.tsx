import React, { useState, useEffect } from 'react';
import Header from './Components/Header/Header';
import TransactionsNav from './Components/TranactionsNav/TransactionsNav';
import Transactions from './Components/Transactions/Transactions';
import TransactionsNewForm from './Components/TransactionsNewForm/TransactionsNewForm';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useHistory } from 'react-router-dom';
import { RevokeToken } from './TokenService/TokenService';
import { ITransactionsPageParams } from './Interfaces/Params/ITransactionsPageParams';
import { IMessage } from './Interfaces/IMessage';

function TransactionsPage(): JSX.Element {
  const { accountId }: ITransactionsPageParams = useParams();

  const history: any = useHistory();

  const [ newTransactionModalVisiblity, setNewTransactionModalVisiblity ] = useState<boolean>(false);

  const [ transactionsMessage, setTransactionsMessage ] = useState<IMessage | null>(null);

  const handleCloseModal = (): void => {
    setNewTransactionModalVisiblity(false);
  };

  useEffect (()=>{
    const redirectToLoginPage = (): void => {
      history.push('/')
    }  

    if (transactionsMessage) {
      if (transactionsMessage.status === 'success'){
        toast.success(transactionsMessage.message);
        setTimeout(reloadWindow, 5000);
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
  }, [ transactionsMessage, history ])

  const reloadWindow = (): void => {
    window.location.reload();
  }

  return (
    <div className="App">
      <Header isTransactionsPage = {true} />
      <TransactionsNav
          openModal={() => setNewTransactionModalVisiblity(true)}
      />
      <Transactions accountId={accountId} />
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
