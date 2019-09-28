import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Authentication from "./Authentication";
import Registration from "./Registration";
import "./LoginContainer.css";

class LoginContainer extends React.Component {
    render() {
        return (
            <Row>
                <Col className="loginColumn panel">
                    <Authentication {...this.props} />
                </Col>
                <Col className="loginColumn col-md-8 col-lg-8 col-xl-9">
                    <Registration />
                </Col>
            </Row>
        );
    }
}

export default LoginContainer;