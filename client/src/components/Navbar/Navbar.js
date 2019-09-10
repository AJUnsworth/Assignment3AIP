import React from "react";
import { Link } from "react-router-dom";

import Logo from "../../images/Seenit Logo_white.png";
import LoginButton from "./Buttons/LoginButton";
import LogoutButton from "./Buttons/LogoutButton";
import "./Navbar.css";

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            authenticated: false
        }
    }

    componentDidMount() {
        //Convert user details from string to a JSON object to be able to access properties
        const user = JSON.parse(localStorage.getItem("User"));
        if (user) {
            this.setState({ authenticated: true });
        }
    }

    logout = () => {
        const self = this;
        fetch("/users/logout", {
            method: "POST"
        })
            .then(function(response) {
                localStorage.removeItem("User");
                self.setState({ authenticated: false });
            })
            .catch(function(error) {
                console.log(error);
            });
    };

    render() {
        return (
            <div className="navbar">
                <div className="navbarContent">
                    <Link to="/">
                        <img src={Logo} alt="logo" className="navbarSizing" />
                    </Link>
                    {this.state.authenticated ? <LogoutButton logout={this.logout} /> : <LoginButton/>}
                </div>
            </div>
        );
    }
}

export default Navbar;