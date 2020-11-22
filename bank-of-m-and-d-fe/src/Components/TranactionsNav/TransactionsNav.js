import React from 'react';
import './transactionsNav.css';

function TransactionsNav(props) {
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
