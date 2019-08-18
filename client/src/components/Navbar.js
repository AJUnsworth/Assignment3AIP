import React from 'react';
import './Navbar.css';
import Logo from '../images/Logo-01.png';
import Button from 'react-bootstrap/Button';

export class Navbar extends React.Component {
    render() {
        return (
            <div class="navbar">
                <div class="navbarContent">
                    {/* Logo */}
                    <img src={ Logo } alt="logo" class="navbarSizing"/>
                    {/* log in option if user unknown, account option if logged in */}
                    <Button variant="outline-light" className="loginButton">Log in</Button>
                </div>
            </div>
        );
    }
} 