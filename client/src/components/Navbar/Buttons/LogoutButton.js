import React from "react";
import Button from "react-bootstrap/Button";
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";

import ActionModal from "../../ActionModal/ActionModal";
import "./Button.css";

//Enables logged in users to logout
//Button not shown for guest users
function LogoutButton(props) {
    const [showLogout, setShowLogout] = React.useState(false);

    const handleShowLogout = () => setShowLogout(!showLogout);

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