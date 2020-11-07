import React from 'react';
import { toast } from 'react-toastify';
import './AccountsNav.css';

function AccountsNav(props) {
    function home() {
        window.location.reload();
      }
    const handleLogoutClick = () => {
        localStorage.removeItem('bearerToken');
        toast.success("You have logged out.");
        setTimeout(home, 5000);
    }

    return (
            <div className="subNav">
                {localStorage.getItem('bearerToken') && (<button className="subNavButton" onClick={handleLogoutClick}>Logout</button>)}
                <button className="subNavButton" onClick={props.openLoginModal}>Login</button>
                {localStorage.getItem('bearerToken') && (<button className="subNavButton" onClick={props.openNewAccountModal}>New Account</button>)}
            </div>
    )
}

export default AccountsNav;
