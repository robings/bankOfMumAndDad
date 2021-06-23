import React from 'react';
import { ITransactionsNavProps } from '../../Interfaces/Props/ITransactionsNavProps';
import './transactionsNav.css';
import { LoggedIn } from '../../TokenService/TokenService';
import { RouteComponentProps, useHistory } from 'react-router-dom';


function TransactionsNav(props: ITransactionsNavProps): JSX.Element {
  const history = useHistory<RouteComponentProps>();

  const handleOpenNewTransactionModal = ():void => {
    if (!LoggedIn()) {
      history.push('/');
    }
    props.openNewTransactionModal();
  }
  
  return (
    <div className="subNav">
      {localStorage.getItem('bearerToken') && 
      <button className="subNavButton" onClick={handleOpenNewTransactionModal}>
        New Transaction
      </button>}
    </div>
  );
}

export default TransactionsNav;
