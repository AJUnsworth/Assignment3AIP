import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFrown } from "@fortawesome/free-solid-svg-icons";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button'

import Navbar from "../Navbar/Navbar";


class User extends React.Component {

    render() {
        return (
            <div>
                <Navbar {...this.props} />
                <Row className="align-items-center">
                <Col className="verticalColPadding textCentred">
                    <FontAwesomeIcon icon={faFrown} className="fa-10x" />
                    <h1>404 - Page not found</h1>
                    <p>The page you are looking for does not exist.</p>
                    <Link to="/" ><Button variant="info">Go Home</Button></Link>
                </Col>
                </Row>
            </div>
        );
    }
}

export default User;