import React from 'react';
import './header.css';
import logo from './m-d.jpg';

function Header() {
    return (
        <header>
            <img src={logo} alt="Fraught Mum and Dad" />
            <h1>
                Bank Of Mum And Dad
            </h1>
        </header>
    );
}

export default Header;
