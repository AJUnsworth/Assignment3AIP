import React from "react";
import { Link } from "react-router-dom";

import Logo from "../../images/Seenit Logo_white.png";
import AdminButton from "./Buttons/AdminButton";
import LoginButton from "./Buttons/LoginButton";
import LogoutButton from "./Buttons/LogoutButton";
import ViewProfileButton from "./Buttons/ViewProfileButton";

import "./Navbar.css";

class Navbar extends React.Component {
    renderNavButtons() {
        if (this.props.currentUser) {
            return (
                <>
                    <LogoutButton logout={this.props.logout} loading={this.props.loading} />
                    <ViewProfileButton {...this.props} />
                    {this.props.currentUser.isAdmin && 
                        <AdminButton/>
                    }
                </>
            );
        }
        else {
            return(
                <LoginButton />
            );   
        }
    }

    render() {
        return (
            <div className="navbar">
                <div className="navbarContent">
                    <Link to="/">
                        <img src={Logo} alt="logo" className="navbarLogo" />
                    </Link>
                    {this.renderNavButtons()}
                </div>
            </div>
        );
    }
}

export default Navbar;