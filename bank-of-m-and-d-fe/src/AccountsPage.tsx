import React, { useState, useEffect } from 'react';
import { useHistory, RouteComponentProps } from 'react-router-dom';
import Header from './Components/Header/Header';
import AccountsList from './Components/AccountsList/AccountsList';
import AccountsNav from './Components/AccountsNav/AccountsNav';
import AccountsNewForm from './Components/AccountsNewForm/AccountsNewForm';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RevokeToken, LoggedIn } from "./TokenService/TokenService";
import { IMessage } from './Interfaces/IMessage';

function AccountsPage(): JSX.Element {
  const [newAccountModalVisibility, setNewAccountModalVisibility] = useState<boolean>(false);
  const [accountsMessage, setAccountsMessage] = useState<IMessage | null>(null);
  const [loggedIn] = useState<boolean>(LoggedIn);
  const history = useHistory<RouteComponentProps>();

  const handleCloseModal = (): void => {
    setNewAccountModalVisibility(false);
  };

  useEffect ((): void => {
    const redirectToLoginPage = () => {
      history.push('/')
    }

    if (!loggedIn) {
      redirectToLoginPage();
    }
    
    if (accountsMessage) {
      if (accountsMessage.status === 'success'){
        toast.success(accountsMessage.message);
        setTimeout(reloadWindow, 5000);
      }
      else if (accountsMessage.status === 'error' && accountsMessage.message === 'You are not logged in') {
        RevokeToken();
        toast.error('For your security, you have been logged out');
        setTimeout(redirectToLoginPage, 5000);;
      }
      else {
        toast.error(accountsMessage.message);
      }
    }
  }, [accountsMessage, loggedIn, history])

  const reloadWindow = (): void => {
    window.location.reload();
  }

  return (
    <div className="App">
      <Header isTransactionsPage = {false} />
      <AccountsNav
        openNewAccountModal={() => setNewAccountModalVisibility(true)}
      />
      <AccountsList />
      {newAccountModalVisibility && (
        <AccountsNewForm
          setAccountsMessage={setAccountsMessage}
          closeModal={() => handleCloseModal()}
        />
      )}
      <ToastContainer />
    </div>
  );
}

export default AccountsPage;
