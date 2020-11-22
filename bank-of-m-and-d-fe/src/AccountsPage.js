import React, { useState } from "react";
import Header from './Components/Header/Header';
import AccountsList from './Components/AccountsList/AccountsList';
import AccountsNav from './Components/AccountsNav/AccountsNav';
import AccountsNewForm from './Components/AccountsNewForm/AccountsNewForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AccountsPage.css';

function AccountsPage() {
  const [newAccountModalVisibility, setNewAccountModalVisibility] = useState(false);

  const handleCloseModal = () => {
    setNewAccountModalVisibility(false);
    window.location.reload();
  };

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
          closeModal={() => handleCloseModal("AccountsNewForm")}
        />
      )}
      <ToastContainer />
    </div>
  );
}

export default AccountsPage;
