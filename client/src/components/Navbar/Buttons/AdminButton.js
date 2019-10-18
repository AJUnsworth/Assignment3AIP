import React from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import PropTypes from 'prop-types';

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

AdminButton.propTypes = {
    currentUser: PropTypes.object
};

export default AdminButton;