import React from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

import Logo from "../../images/Seenit Logo_white.png";
import "./Navbar.css";

class Navbar extends React.Component {
    render() {
        return (
            <div className="navbar">
                <div className="navbarContent">
                    <Link to="/">
                        <img src={Logo} alt="logo" className="navbarSizing" />
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