import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import LoginForm from "./Forms/LoginForm";
import RegistrationForm from "./Forms/RegistrationForm";
import "./AuthenticationContainer.css";

function AuthenticationContainer(props) {
        return (
            <Row>
                <Col className="loginColumn panel">
                    <LoginForm {...props} />
                </Col>
                <Col className="loginColumn col-md-8 col-lg-8 col-xl-9">
                    <RegistrationForm />
                </Col>
            </Row>
        );
}

export default AuthenticationContainer;