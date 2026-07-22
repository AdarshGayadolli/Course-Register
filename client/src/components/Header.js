import React from 'react';
import logo from '../assets/MEDINI TECHNOLOGIES WHITE.png';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <img src={logo} alt="Medini Technologies" className="header-logo" />
        </div>
      </div>
    </header>
  );
}

export default Header;
