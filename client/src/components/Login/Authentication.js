import React from "react";
import { withRouter, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { NotificationManager } from "react-notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import Logo from "../../images/Seenit Logo_white.png";
import "./Authentication.css";

// Form uses skeleton code & logic from React Bootstrap Documentation
// https://react-bootstrap.github.io/components/forms/#forms-validation-native

class Authentication extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            errors: {},
            loading: false
        };
    }

    handleChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    }

    handleSubmit = e => {
        e.preventDefault();
        const self = this;
        this.setState({ loading: true });

        fetch("/users/login", {
            method: "POST",
            body: JSON.stringify(this.state),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(function (response) {
                self.setState({ loading: false });
                if (response.status === 404 || response.status === 400) {
                    response.json().then(function (data) {
                        self.setState({ errors: data });
                    });
                } else if (response.status === 200) {
                    response.json().then(function (data) {
                        self.props.setUser(data);
                        self.props.history.push("/");
                    });
                } else if (response.status === 405) { 
                    NotificationManager.error(
                        "Too many accounts have logged in from the same location in the past 24 hours, please use one of the previously used accounts",
                        "Too many logins",
                        7000
                    );
                } else {
                    NotificationManager.error(
                        "Looks like something went wrong while logging in, please try again later",
                        "Error logging in",
                        5000
                    );
                }
            });
    }

    render() {
        return (
            <Container>
                <Row className="justify-content-md-center">
                    <Col md="10">
                        <img src={Logo} alt="logo" className="loginLogo" />
                        <Form noValidate onSubmit={this.handleSubmit}>
                            <Form.Group controlId="username" className="text-left text-white">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="loginUsername"
                                    placeholder="Enter username"
                                    onChange={this.handleChange}
                                    value={this.state.username}
                                    isInvalid={this.state.errors.username}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {this.state.errors.username}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="password" className="text-left text-white">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="loginPassword"
                                    placeholder="Password"
                                    onChange={this.handleChange}
                                    value={this.state.password}
                                    isInvalid={this.state.errors.password}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {this.state.errors.password}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group>
                                <Button name="loginBtn" variant="outline-light" type="submit" block>
                                    {this.state.loading? 
                                    <FontAwesomeIcon id="loading" className="fa-lg loadingPostIcon" icon={faSpinner} spin />
                                    : "Login"}
                                </Button>
                            </Form.Group>
                            <Form.Group>
                                <Link to="/" className="text-white textBold"> ← Go back to previous page</Link>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Container>
        );
    };
}

export default withRouter(Authentication);