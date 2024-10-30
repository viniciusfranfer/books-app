import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LogOut from '../utils/auth/auth.js';
import bookAppLogoRbg from '../assets/logo/Book_app-logo-removedbg-resized.png';
import './styles/NavBar.css';

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <Link to="/home"><img src={bookAppLogoRbg} alt="Logo" className="logo" /></Link>
      
      <div className="menu-icon" onClick={toggleMenu}>
        <div className={`bar ${isOpen ? 'open' : ''}`}></div>
        <div className={`bar ${isOpen ? 'open' : ''}`}></div>
        <div className={`bar ${isOpen ? 'open' : ''}`}></div>
      </div>

      <ul className={`nav-links-navBar ${isOpen ? 'show' : ''}`}>
        <Link className='link' to="/home">inicio</Link>
        <Link className='link' to="/books">Livros</Link>
        <Link className='link' to="/bookList">Listas</Link>
        <Link className='link' to="/profile">Perfil</Link>
        <Link className='link' onClick={LogOut} to="/">Sair</Link>
      </ul>
    </nav>
  );
}

export default NavBar;
