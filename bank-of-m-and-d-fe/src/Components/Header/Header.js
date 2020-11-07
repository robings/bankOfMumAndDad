import React, { useState } from 'react';
import LoginForm from '../LoginForm/LoginForm';
import { toast } from 'react-toastify';
import './header.css';
import logo from './m-d.jpg';

function Header() {
    const [loginModalVisibility, setLoginModalVisibility] = useState(false);

    function home() {
        window.location.reload();
      }

    const handleLogoutClick = () => {
        localStorage.removeItem('bearerToken');
        toast.success("You have logged out.");
        setTimeout(home, 5000);
    }

    const handleLoginClick = () => {
        setLoginModalVisibility(true);
    }

    const handleCloseModal = () => {
        setLoginModalVisibility(false);
        window.location.reload();
      };

    return (
        <header>
            <img src={logo} alt="Fraught Mum and Dad" />
            <h1>
                Bank Of Mum And Dad
            </h1>
            <div className="headerButtons">
            {localStorage.getItem('bearerToken') && (<button className="subNavButton" onClick={handleLogoutClick}>Logout</button>)}
                <button className="subNavButton" onClick={handleLoginClick}>Login</button>
            {loginModalVisibility && (
                <LoginForm
                loginModalVisibility={loginModalVisibility}
                closeModal={handleCloseModal}
                />
            )}
          </div>
        </header>
    );
}

export default Header;
