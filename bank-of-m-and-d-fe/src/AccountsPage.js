import React, { useState } from "react";
import Header from './Components/Header/Header';
import AccountsList from "./Components/AccountsList/AccountsList";
import AccountsNav from './Components/AccountsNav/AccountsNav';
import AccountsNewForm from './Components/AccountsNewForm/AccountsNewForm'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './AccountsPage.css';

function AccountsPage() {
  const [newAccountModalVisiblity, setNewAccountModalVisiblity] = useState(false);

  const handleCloseModal = () => {
    setNewAccountModalVisiblity(false);
    window.location.reload();
  };

  return (
    <div className="App">
      <Header />
      <AccountsNav openModal={() => setNewAccountModalVisiblity(true)} />
      <AccountsList />
      {newAccountModalVisiblity && (
        <AccountsNewForm
          newAccountModalVisibility={newAccountModalVisiblity}
          closeModal={() => handleCloseModal()}
        />
      )}
      <ToastContainer />
    </div>
  );
}

export default AccountsPage;
