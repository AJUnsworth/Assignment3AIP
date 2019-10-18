import React from "react";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import ActionModal from "../../ActionModal/ActionModal";
import "./Button.css";

function LogoutButton(props) {
    const [showLogout, setShowLogout] = React.useState(false);

    //Display/close modal for logging out
    const handleShowLogout = () => setShowLogout(!showLogout);

    //Hides logout modal, logs out user and pushes them to the homepage
    const handleLogout = () => {
        handleShowLogout();
        props.logout();
        props.history.push("/");
    }

    return (
        <>
            <Button onClick={handleShowLogout} variant="outline-light" className="navbarButton"> Log out </Button>

            <ActionModal
                show={showLogout}
                handleShowModal={handleShowLogout}
                title={"Logout"}
                handleModalAction={handleLogout}
                modalActionText={"Logout"}
            >
                Are you sure you want to logout?
            </ActionModal>
        </>
    );
};

LogoutButton.propTypes = {
    logout: PropTypes.func.isRequired
};

export default withRouter(LogoutButton);