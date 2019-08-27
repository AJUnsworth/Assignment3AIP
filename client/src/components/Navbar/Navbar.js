import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import Logo from '../../images/Logo-01.png';
import Button from 'react-bootstrap/Button';

class Navbar extends React.Component {
    render() {
        return (
            <div className="navbar">
                <div className="navbarContent">
                    <Link to="/">
                        <img src={ Logo } alt="logo" className="navbarSizing"/>
                    </Link>
                    <Link to="/loginContainer/">
                        <Button variant="outline-light" className="loginButton">Log in</Button>
                    </Link>
                </div>
            </div>
        );
    }
} 

export default Navbar;