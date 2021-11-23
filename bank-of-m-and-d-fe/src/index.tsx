import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import LoginPage from './LoginPage';
import AccountsPage from './AccountsPage';
import TransactionsPage from './TransactionsPage';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/accounts" element={<AccountsPage />} />
        <Route path="/transactions/:accountId" element={<TransactionsPage />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
