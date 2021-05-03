import React from 'react';
import { ITransactionsNavProps } from '../../Interfaces/Props/ITransactionsNavProps';
import './transactionsNav.css';

function TransactionsNav(props: ITransactionsNavProps): JSX.Element {
  return (
    <div className="subNav">
      {localStorage.getItem('bearerToken') && 
      <button className="subNavButton" onClick={props.openModal}>
        New Transaction
      </button>}
    </div>
  );
}

export default TransactionsNav;
