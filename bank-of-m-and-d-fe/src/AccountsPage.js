import React, { useState } from "react";
import Header from './Components/Header/Header';
import AccountsList from './Components/AccountsList/AccountsList';
import AccountsNav from './Components/AccountsNav/AccountsNav';
import AccountsNewForm from './Components/AccountsNewForm/AccountsNewForm';
import LoginForm from './Components/LoginForm/LoginForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AccountsPage.css';

function AccountsPage() {
  const [newAccountModalVisibility, setNewAccountModalVisibility] = useState(false);
  const [loginModalVisibility, setLoginModalVisibility] = useState(false);

  const handleCloseModal = (modal) => {
    if (modal === "AccountsNewForm") {
      setNewAccountModalVisibility(false);
    }
    if (modal === "LoginForm") {
      setLoginModalVisibility(false);
    }
    
    window.location.reload();
  };

  return (
    <div className="App">
      <Header />
      <AccountsNav
        openNewAccountModal={() => setNewAccountModalVisibility(true)}
        openLoginModal={() => setLoginModalVisibility(true)}
      />
      <AccountsList />
      {newAccountModalVisibility && (
        <AccountsNewForm
          newAccountModalVisibility={newAccountModalVisibility}
          closeModal={() => handleCloseModal("AccountsNewForm")}
        />
      )}
      {loginModalVisibility && (
        <LoginForm
          loginModalVisibility={loginModalVisibility}
          closeModal={() => handleCloseModal("LoginForm")}
        />
      )}
      <ToastContainer />
    </div>
  );
}

export default AccountsPage;
