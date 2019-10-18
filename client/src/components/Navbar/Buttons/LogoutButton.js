import React from "react";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import ActionModal from "../../ActionModal/ActionModal";
import "./Button.css";

//Based on Modal tutorial from React-Bootstrap
//See https://react-bootstrap.github.io/components/modal/

//Enables logged in users to logout
//Button not shown for guest users
function LogoutButton(props) {
    const [showLogout, setShowLogout] = React.useState(false);

    const handleShowLogout = () => setShowLogout(!showLogout);

    const handleLogout = () => {
        handleShowLogout();
        props.logout();
    }

    if (props.loading) {
        return <FontAwesomeIcon id="loading" className="fa-3x loadingPostIcon" icon={faSpinner} spin />;
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

export default LogoutButton;