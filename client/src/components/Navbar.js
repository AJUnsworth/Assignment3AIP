import React from 'react';
import './Navbar.css';

export class Navbar extends React.Component {
    render () {
        return (
            <div class="navbar">
                {/* Logo */}
                <img src="#" alt="#"/>
                {/* log in option if user unknown, account option if logged in */}
                <button>Log in</button>
            </div>
        );
    }
} 