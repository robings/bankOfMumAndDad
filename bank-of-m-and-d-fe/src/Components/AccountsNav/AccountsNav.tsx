import React from 'react';
import { IAccountsNavProps } from '../../Interfaces/Props/IAccountsNavProps';

function AccountsNav(props: IAccountsNavProps): JSX.Element {
  return (
    <div className="subNav">
      {localStorage.getItem('bearerToken') && (<button className="subNavButton" onClick={props.openNewAccountModal}>New Account</button>)}
    </div>
  )
}

export default AccountsNav;
