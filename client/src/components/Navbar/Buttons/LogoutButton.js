import React from "react";
import Button from "react-bootstrap/Button";

import "./Button.css";

function LogoutButton(props) {
    return (
        <Button onClick={props.logout} variant="outline-light" className="authenticationButton">Log out</Button>
    );
};

export default LogoutButton;