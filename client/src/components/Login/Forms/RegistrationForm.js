import React from "react";
import { NotificationManager } from "react-notifications";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import "./RegistrationForm.css";

// Form uses skeleton code & logic from React Bootstrap Documentation
// https://react-bootstrap.github.io/components/forms/#forms-validation-native

class RegistrationForm extends React.Component {
    constructor(props) {
        super(props);
        this.initialState = {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            errors: {},
            loading: false
        };

        this.state = this.initialState;
    }

    handleChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    }

    handleSubmit = e => {
        e.preventDefault();
        const self = this;
        this.setState({ loading: true });

        fetch("/users/register", {
            method: "POST",
            body: JSON.stringify(this.state),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(function (response) {
                if (response.status === 400) {
                    response.json().then(function (data) {
                        self.setState({
                            errors: data,
                            loading: false
                        });
                    })
                }
                else if (response.status === 200) {
                    self.setState(self.initialState);
                    NotificationManager.success("Account created successfully", "Account Registered");
                } else {
                    self.setState({ loading: false });
                    NotificationManager.error(
                        "Looks like something went wrong while creating an account, please try again later",
                        "Error registering account",
                        5000
                    );

                }
            });
    }

    render() {
        return (
            <Container>
                <Row>
                    <h1 className="titlePadding" id="registerTitle">Register for an account today!</h1>
                </Row>
                <Form noValidate onSubmit={this.handleSubmit}>
                    <Row>
                        <Col md="6">
                            <Form.Group controlId="username">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="username"
                                    placeholder="Enter username"
                                    onChange={this.handleChange}
                                    value={this.state.username}
                                    isInvalid={this.state.errors.username}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {this.state.errors.username}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="email">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    placeholder="Enter email"
                                    onChange={this.handleChange}
                                    value={this.state.email}
                                    isInvalid={this.state.errors.email}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {this.state.errors.email}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    onChange={this.handleChange}
                                    value={this.state.password}
                                    isInvalid={this.state.errors.password}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {this.state.errors.password}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="confirmPassword">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Password"
                                    onChange={this.handleChange}
                                    value={this.state.confirmPassword}
                                    isInvalid={this.state.errors.confirmPassword}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {this.state.errors.confirmPassword}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group>
                                <Button variant="primary" type="submit" name="registerBtn">
                                    {this.state.loading ?
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                        : "Register"}
                                </Button>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Container>
        );
    };
}

export default RegistrationForm;