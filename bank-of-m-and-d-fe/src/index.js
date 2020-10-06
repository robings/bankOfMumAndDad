import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AccountsPage from './AccountsPage';
import TransactionsPage from "./TransactionsPage";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path="/" component={AccountsPage} />
        <Route path="/transactions/:accountId" component={TransactionsPage} />
        <Route component={AccountsPage} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
