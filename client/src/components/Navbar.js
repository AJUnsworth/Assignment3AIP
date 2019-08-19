import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import Logo from '../images/Logo-01.png';
import Button from 'react-bootstrap/Button';

export class Navbar extends React.Component {
    render() {
        return (
            <div class="navbar">
                <div class="navbarContent">
                    <Link to="/">
                        <img src={ Logo } alt="logo" class="navbarSizing"/>
                    </Link>
                    <Button variant="outline-light" className="loginButton">Log in</Button>
                </div>
            </div>
        );
    }
} 

export default Navbar;