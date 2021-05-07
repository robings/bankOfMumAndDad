import React, { useState, useEffect } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import './header.css';
import logo from './m-d.jpg';
import { RevokeToken, LoggedIn } from '../../TokenService/TokenService';
import { IHeaderProps } from '../../Interfaces/Props/IHeaderProps';

function Header(props: IHeaderProps): JSX.Element {
    const [loggedIn] = useState<boolean>(LoggedIn);
    const [isTransactionsPage] = useState<boolean>(props.isTransactionsPage);

    const history = useHistory<RouteComponentProps>();

    useEffect ((): void => {
        if (!loggedIn){
            history.push('/');
        }
    }, [loggedIn, history])

    const handleLogoutClick = (): void => {
        RevokeToken();
        history.push('/');
    }

    const handleRevokeToken = (): void => {
        RevokeToken();
    }

    const handleHomeButtonClick = (): void => {
        history.push('/accounts');
    }
    
    return (
        <header>
            <section>
                <img src={logo} alt="Fraught Mum and Dad" />
                <h1>
                    Bank Of Mum And Dad
                </h1>
            </section>
            <section>
                <div className="headerButtons">
                {loggedIn && (<button className="subNavButton" onClick={handleLogoutClick}>
                    <svg version="1.1" className="svgButton" id="logoutButton" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 32 32">
                        <path d="M 19 14 L19 6 L2 6 L2 31 L19 31 L19 24" stroke="currentColor" strokeWidth="2" fill="transparent" />
                        <line x1="7" y1="14" x2="26" y2="14" stroke="currentColor" strokeWidth="1" />
                        <line x1="7" y1="24" x2="26" y2="24" stroke="currentColor" strokeWidth="1" />
                        <path d="M 24 8 L32 19 L24 29 L29 19 L24 8" fill="currentColor" />
                    </svg>
                    <div style={{float: "right", padding: "7px 5px"}}>Log Out</div>
                </button>)}
                {isTransactionsPage && (<button className="subNavButton" onClick={handleHomeButtonClick}>
                    <svg version="1.1" className="svgButton" id="homeButton" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 32 32">
                        <path d="M 0 20 L16 4 L32 20 L31 22 L16 7 L1 22 L0 20" fill="currentColor"/>
                        <path d="M 4 17 L4 32 L28 32 L28 17 L26 16 L26 30 L6 30 L6 16 L4 17" fill="currentColor" />
                        <path d="M 24 14 L24 4 L20 4 L20 10 L24 14" stroke="currentColor" fill="transparent" />
                        <rect x="8" y="20" width="6" height="6" stroke="currentColor" fill="transparent" />
                        <rect x="18" y="20" width="6" height="9" stroke="currentColor" fill="transparent" />
                    </svg>
                    <div style={{float: "right", padding: "7px 5px"}}>Accounts</div>
                </button>)}
                </div>
                <div>{localStorage.getItem('loginTime') ? localStorage.getItem('loginTime') : 'Not logged in'}
                <button className="subNavButton" onClick={handleRevokeToken}>
                    Revoke Token
                </button>
                </div>
            </section>
        </header>
    );
}

export default Header;
