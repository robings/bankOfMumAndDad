import React from 'react';
import Header from './Components/Header/Header';
import AccountsList from './Components/AccountsList/AccountsList';
import Transactions from './Components/Transactions/Transactions'
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <AccountsList />
      <Transactions />
    </div>
  );
}

export default App;
