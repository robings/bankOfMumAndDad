import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Header from './Components/Header/Header';
import AccountsList from './Components/AccountsList/AccountsList';
import AccountsNav from './Components/AccountsNav/AccountsNav';
import AccountsNewForm from './Components/AccountsNewForm/AccountsNewForm';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RevokeToken } from "./TokenService/TokenService";

function AccountsPage() {
  const [newAccountModalVisibility, setNewAccountModalVisibility] = useState(false);
  const [accountsMessage, setAccountsMessage] = useState({});

  const history = useHistory();

  const handleCloseModal = () => {
    setNewAccountModalVisibility(false);
  };

  useEffect (()=> {
    const redirectToLoginPage = () => {
      history.push('/')
    }

    if (accountsMessage) {
      if (accountsMessage.status === 'success'){
        toast.success(accountsMessage.message);
        setTimeout(reloadWindow, 5000);
      }
      else if (accountsMessage.status === 'error' && accountsMessage.message === 'You are not logged in') {
        RevokeToken();
        toast.error(accountsMessage.message);
        setTimeout(redirectToLoginPage, 5000);
      }
      else {
        toast.error(accountsMessage.message);
      }
    }
  }, [accountsMessage, history])

  const reloadWindow = () => {
    window.location.reload();
  }

  return (
    <div className="App">
      <Header />
      <AccountsNav
        openNewAccountModal={() => setNewAccountModalVisibility(true)}
      />
      <AccountsList />
      {newAccountModalVisibility && (
        <AccountsNewForm
          newAccountModalVisibility={newAccountModalVisibility}
          setAccountsMessage={setAccountsMessage}
          closeModal={() => handleCloseModal("AccountsNewForm")}
        />
      )}
      <ToastContainer />
    </div>
  );
}

export default AccountsPage;
