import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import Logo from "../../images/Seenit Logo_white.png";
import NavbarButton from "./Buttons/NavbarButton";
import LogoutButton from "./Buttons/LogoutButton";

import "./Navbar.css";

//Navigation bar that enables users to login, logout, view their profile, and view the admin page if user is an admin
function Navbar(props) {
    const renderNavButtons = () => {
        if (props.currentUser) {
            return (
                <>
                    <LogoutButton {...props}/>
                    <NavbarButton linkTo={`/user/${props.currentUser.id}`}>View Profile</NavbarButton>
                    {props.currentUser.isAdmin &&
                        <NavbarButton linkTo={"/admin"}>View Admin</NavbarButton>
                    }
                </>
            );
        }
        else {
            return (
                <NavbarButton linkTo={"/login"}>Login/Register</NavbarButton>
            );
        }
    }

    return (
        <div className="navbar">
            <div className="navbarContent">
                <Link to="/">
                    <img src={Logo} alt="logo" className="navbarLogo" />
                </Link>
                {renderNavButtons()}
            </div>
        </div>
    );
}

Navbar.propTypes = {
    currentUser: PropTypes.object,
    logout: PropTypes.func
};

export default Navbar;