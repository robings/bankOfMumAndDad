import React, { useState, useEffect } from 'react';
import Header from './Components/Header/Header';
import TransactionsNav from './Components/TranactionsNav/TransactionsNav';
import Transactions from './Components/Transactions/Transactions';
import TransactionsNewForm from './Components/TransactionsNewForm/TransactionsNewForm';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useHistory } from 'react-router-dom';
import { RevokeToken } from './TokenService/TokenService';

function TransactionsPage() {
  let { accountId } = useParams();

  const history = useHistory();

  const [
    newTransactionModalVisiblity,
    setNewTransactionModalVisiblity,
  ] = useState(false);

  const [transactionsMessage, setTransactionsMessage] = useState({});

  const handleCloseModal = () => {
    setNewTransactionModalVisiblity(false);
  };

  useEffect (()=>{
    const redirectToLoginPage = () => {
      history.push('/')
    }  

    if (transactionsMessage) {
      if (transactionsMessage.status === 'success'){
        toast.success(transactionsMessage.message);
        setTimeout(reloadWindow, 5000);
      }
      else if (transactionsMessage.status === 'error' && transactionsMessage.message === 'You are not logged in') {
        RevokeToken();
        toast.error(transactionsMessage.message);
        setTimeout(redirectToLoginPage, 5000);
      }
      else if (transactionsMessage.status === 'error') {
        toast.error(transactionsMessage.message);
      }
    }
  }, [transactionsMessage, history])

  const reloadWindow = () => {
    window.location.reload();
  }

  return (
    <div className="App">
      <Header />
      <TransactionsNav
      
      
          openModal={() => setNewTransactionModalVisiblity(true)}
     
     
      />
      <Transactions accountId={accountId} />
      {newTransactionModalVisiblity && (
        <TransactionsNewForm
          newAccountModalVisibility={newTransactionModalVisiblity}
          setTransactionsMessage={setTransactionsMessage}
          closeModal={() => handleCloseModal()}
          accountId ={accountId}
        />
      )}
      <ToastContainer />
    </div>
  );
}

export default TransactionsPage;
