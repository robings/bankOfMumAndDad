import React, { useState, useEffect } from 'react';
import Header from './Components/Header/Header';
import TransactionsNav from './Components/TranactionsNav/TransactionsNav';
import Transactions from './Components/Transactions/Transactions';
import TransactionsNewForm from './Components/TransactionsNewForm/TransactionsNewForm';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';

function TransactionsPage() {
  let { accountId } = useParams();

  const [
    newTransactionModalVisiblity,
    setNewTransactionModalVisiblity,
  ] = useState(false);

  const [transactionsMessage, setTransactionsMessage] = useState({});

  const handleCloseModal = () => {
    setNewTransactionModalVisiblity(false);
  };

  useEffect (()=>{
    if (transactionsMessage) {
      if (transactionsMessage.status === 'success'){
        toast.success(transactionsMessage.message);
        setTimeout(reloadWindow, 5000);
      }
      else if (transactionsMessage.status === 'error' && transactionsMessage.message === 'You are not logged in') {
        if (localStorage.getItem('bearerToken') !== null) {
          localStorage.removeItem('bearerToken');
        }
        reloadWindow();
      }
      else if (transactionsMessage.status === 'error') {
        toast.error(transactionsMessage.message);
      }
    }
  }, [transactionsMessage])

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
