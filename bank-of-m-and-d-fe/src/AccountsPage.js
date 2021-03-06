import React, { useState, useEffect } from "react";
import Header from './Components/Header/Header';
import AccountsList from './Components/AccountsList/AccountsList';
import AccountsNav from './Components/AccountsNav/AccountsNav';
import AccountsNewForm from './Components/AccountsNewForm/AccountsNewForm';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AccountsPage.css';
import { RevokeToken } from "./TokenService/TokenService";

function AccountsPage() {
  const [newAccountModalVisibility, setNewAccountModalVisibility] = useState(false);
  const [accountsMessage, setAccountsMessage] = useState({});

  const handleCloseModal = () => {
    setNewAccountModalVisibility(false);
  };

  useEffect (()=>{
    if (accountsMessage) {
      if (accountsMessage.status === 'success'){
        toast.success(accountsMessage.message);
        setTimeout(reloadWindow, 5000);
      }
      else if (accountsMessage.status === 'error' && accountsMessage.message === 'You are not logged in') {
        RevokeToken();
        toast.error(accountsMessage.message);
      }
      else {
        toast.error(accountsMessage.message);
      }
    }
  }, [accountsMessage])

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
