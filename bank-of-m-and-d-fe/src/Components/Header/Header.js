import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import LoginForm from '../LoginForm/LoginForm';
import { toast } from 'react-toastify';
import './header.css';
import logo from './m-d.jpg';

function Header() {
    const [loginModalVisibility, setLoginModalVisibility] = useState(false);
    const [loginMessage, setLoginMessage] = useState({});
    const history = useHistory();

    useEffect (()=>{
        if (loginMessage) {
          if (loginMessage.status === 'success'){
            toast.success(loginMessage.message);
            setTimeout(reloadPage, 5000);
          }
          else {
            toast.error(loginMessage.message);
          }
        }
      }, [loginMessage])

    function reloadPage() {
        window.location.reload();
      }

    const handleLogoutClick = () => {
        if (localStorage.getItem('bearerToken') !== null) {
            localStorage.removeItem('bearerToken');
        }
        toast.success("You have logged out.");
        setTimeout(redirectPage, 5000);
    }

    const handleLoginClick = () => {
        setLoginModalVisibility(true);
    }

    const handleCloseModal = () => {
        setLoginModalVisibility(false);
      };

    const handleHomeButtonClick = () => {
        history.push('/');
    }
    
    const redirectPage = () => {
        if (history.location.pathname === "/") {
            reloadPage();
        } else {
            handleHomeButtonClick();
        }
    }

    return (
        <header>
            <img src={logo} alt="Fraught Mum and Dad" />
            <h1>
                Bank Of Mum And Dad
            </h1>
            <div className="headerButtons">
            {localStorage.getItem('bearerToken') && (<button className="subNavButton" onClick={handleLogoutClick}>
                <svg version="1.1" className="svgButton" id="logoutButton" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 32 32">
                    <path d="M 19 14 L19 6 L2 6 L2 31 L19 31 L19 24" stroke="currentColor" strokeWidth="2" fill="transparent" />
                    <line x1="7" y1="14" x2="26" y2="14" stroke="currentColor" strokeWidth="1" />
                    <line x1="7" y1="24" x2="26" y2="24" stroke="currentColor" strokeWidth="1" />
                    <path d="M 24 8 L32 19 L24 29 L29 19 L24 8" fill="currentColor" />
                </svg>
                <div style={{float: "right", padding: "7px 5px"}}>Log Out</div>
            </button>)}
            <button className="subNavButton" onClick={handleLoginClick}>
                <svg version="1.1" className="svgButton" id="loginButton" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 32 32">
                    <path d="M 20 14 L20 6 L2 6 L2 31 L20 31 L20 24" stroke="currentColor" strokeWidth="2" fill="transparent" />
                    <line x1="10" y1="14" x2="28" y2="14" stroke="currentColor" strokeWidth="1" />
                    <line x1="10" y1="24" x2="28" y2="24" stroke="currentColor" strokeWidth="1" />
                    <path d="M 14 8 L4 19 L14 29 L7 19 L14 8" fill="currentColor" />
                </svg>
                <div style={{float: "right", padding: "7px 5px"}}>Log In</div>
            </button>
            <button className="subNavButton" onClick={handleHomeButtonClick}>
                <svg version="1.1" className="svgButton" id="homeButton" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 32 32">
                    <path d="M 0 20 L16 4 L32 20 L31 22 L16 7 L1 22 L0 20" fill="currentColor"/>
                    <path d="M 4 17 L4 32 L28 32 L28 17 L26 16 L26 30 L6 30 L6 16 L4 17" fill="currentColor" />
                    <path d="M 24 14 L24 4 L20 4 L20 10 L24 14" stroke="currentColor" fill="transparent" />
                    <rect x="8" y="20" width="6" height="6" stroke="currentColor" fill="transparent" />
                    <rect x="18" y="20" width="6" height="9" stroke="currentColor" fill="transparent" />
                </svg>
            </button>
            {loginModalVisibility && (
                <LoginForm
                loginModalVisibility={loginModalVisibility}
                setLoginMessage={setLoginMessage}
                closeModal={handleCloseModal}
                />
            )}
          </div>
            <div>{localStorage.getItem('loginTime')}</div>
        </header>
    );
}

export default Header;
