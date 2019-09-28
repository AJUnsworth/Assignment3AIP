import React from "react";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";

import "./Button.css";

//Based on Modal tutorial from React-Bootstrap
//See https://react-bootstrap.github.io/components/modal/
function LogoutButton(props) {
    const [showLogout, setShowLogout] = React.useState(false);

    const handleShowLogout = () => setShowLogout(true);
    const handleCloseLogout = () => setShowLogout(false);
    const handleLogout = () => {
        setShowLogout(false);
        props.logout();
    }

    return (
        <>
            <Button onClick={handleShowLogout} variant="outline-light" className="authenticationButton"> Log out </Button>

            <Modal show={showLogout} onHide={handleCloseLogout}>
                <Modal.Header closeButton>
                    <Modal.Title>Logout</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to log out?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseLogout}>
                        Cancel
                    </Button>
                    <Link to="/">
                        <Button variant="primary" onClick={handleLogout}>
                            Log out
                        </Button>
                    </Link>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default LogoutButton;