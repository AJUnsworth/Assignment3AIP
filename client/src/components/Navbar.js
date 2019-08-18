import React from 'react';
import './Navbar.css';
import Logo from '../images/Logo-01.png';

export class Navbar extends React.Component {
    render() {
        return (
            <div class="navbar">
                <div class="navbarContent">
                    {/* Logo */}
                    <img src={ Logo } alt="logo" class="navbarSizing"/>
                    {/* log in option if user unknown, account option if logged in */}
                    <button class="loginButton navbarSizing">Log in</button>
                </div>
            </div>
        );
    }
} 