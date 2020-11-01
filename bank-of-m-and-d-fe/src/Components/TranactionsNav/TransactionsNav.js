import React from 'react';
import { useHistory } from 'react-router-dom';
import './transactionsNav.css';

function TransactionsNav(props) {
  const history = useHistory();

  function handleHomeButtonClick() {
    history.push('/');
  }

  return (
    <div className="subNav">
      <button className="subNavButton" onClick={props.openModal}>
        New Transaction
      </button>
      <button className="subNavButton" onClick={handleHomeButtonClick}>
        Home
      </button>
    </div>
  );
}

export default TransactionsNav;
