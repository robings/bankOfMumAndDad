import React, { useState } from "react";
import Header from './Components/Header/Header';
import AccountsList from './Components/AccountsList/AccountsList';
import Transactions from './Components/Transactions/Transactions';
import AccountsNav from './Components/AccountsNav/AccountsNav';
import AccountsNewForm from './Components/AccountsNewForm/AccountsNewForm'
import './AccountsPage.css';

const accountData = {
  id: 10024,
  firstName: 'Jemima',
  lastName: 'Canard',
  openingBalance: 300,
  currentBalance: 300,
};

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
      <Transactions accountData={accountData} />
      {newAccountModalVisiblity && (
        <AccountsNewForm
          newAccountModalVisibility={newAccountModalVisiblity}
          closeModal={() => handleCloseModal()}
        />
      )}
    </div>
  );
}

export default AccountsPage;
