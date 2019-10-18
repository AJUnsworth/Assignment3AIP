import React from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

import "./Button.css";

//Directs admin users to admin page
function AdminButton(props) {
    return (
        <Link to="/admin/">
            <Button variant="outline-light navbarButton" >
                Admin Page
            </Button>
        </Link>
    );
}

export default AdminButton;