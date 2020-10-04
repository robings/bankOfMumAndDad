import React from 'react';
import Header from './Components/Header/Header';
import AccountsList from './Components/AccountsList/AccountsList';
import Transactions from './Components/Transactions/Transactions';
import AccountsNav from './Components/AccountsNav/AccountsNav';
import './AccountsPage.css';

const accountData = {
  id: 10024,
  firstName: 'Jemima',
  lastName: 'Canard',
  openingBalance: 300,
  currentBalance: 300,
};

function AccountsPage() {
  return (
    <div className="App">
      <Header />
      <AccountsNav />
      <AccountsList />
      <Transactions accountData={accountData} />
    </div>
  );
}

export default AccountsPage;
