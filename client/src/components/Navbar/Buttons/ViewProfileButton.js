import React from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

import "./Button.css";

function ViewProfileButton(props) {
    return (
        <a href={props.currentUser ? "/user/" + props.currentUser.id : "/login"}>
            <Button variant="outline-light authenticationButton" >
                View Profile
            </Button>
        </a>
    );
}

export default ViewProfileButton;