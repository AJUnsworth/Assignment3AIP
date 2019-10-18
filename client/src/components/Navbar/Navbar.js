import React from "react";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

import Logo from "../../images/Seenit Logo_white.png";
import AdminButton from "./Buttons/AdminButton";
import LoginButton from "./Buttons/LoginButton";
import LogoutButton from "./Buttons/LogoutButton";
import ViewProfileButton from "./Buttons/ViewProfileButton";

import "./Navbar.css";

//Navigation bar that enables users to login, logout, view their profile, and view the admin page if user is an admin
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

Navbar.propTypes = {
    currentUser: PropTypes.object,
    logout: PropTypes.func,
    loading: PropTypes.bool
};

export default Navbar;