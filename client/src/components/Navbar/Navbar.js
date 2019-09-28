import React from "react";
import { Link } from "react-router-dom";

import Logo from "../../images/Seenit Logo_white.png";
import LoginButton from "./Buttons/LoginButton";
import LogoutButton from "./Buttons/LogoutButton";
import "./Navbar.css";

class Navbar extends React.Component {
    render() {
        return (
            <div className="navbar">
                <div className="navbarContent">
                    <Link to="/">
                        <img src={Logo} alt="logo" className="navbarSizing" />
                    </Link>
                    {this.props.currentUser ? <LogoutButton logout={this.props.logout} /> : <LoginButton/>}
                </div>
            </div>
        );
    }
}

export default Navbar;