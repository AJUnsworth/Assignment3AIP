import React from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

import "./Button.css";

function AdminButton(props) {
    return (
        <Link to="/admin/">
            <Button variant="outline-light authenticationButton" >
                Admin Page
            </Button>
        </Link>
    );
}

export default AdminButton;