import React from "react";
import { withRouter } from "react-router-dom";
import Button from "react-bootstrap/Button";
import PropTypes from 'prop-types';

import "./Button.css";

//Generic Navbar button for any link-based buttons
function NavbarButton(props) { 
    const navigateTo = () => props.history.push(props.linkTo);

    return (
        <Button variant="outline-light" className="navbarButton" onClick={navigateTo}>
            {props.children}
        </Button>
    );
};

NavbarButton.propTypes = {
    linkTo: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
};

export default withRouter(NavbarButton);