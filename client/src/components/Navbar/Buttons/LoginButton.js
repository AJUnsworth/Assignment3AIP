import React from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

import "./Button.css";

function LoginButton(props) {
    return (
        <Link to="/login/">
            <Button variant="outline-light" className="navbarButton">Log in / Register</Button>
        </Link>
    );
}

export default LoginButton;