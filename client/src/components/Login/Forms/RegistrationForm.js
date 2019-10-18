import React from "react";
import { NotificationManager } from "react-notifications";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { showError, getError } from "../../../errors";
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

    //Updates field's corresponding state as user enters details
    handleChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    }

    //Submit user's details, which are validated in the backend and any validation errors are returned, including if a user is a sockpuppet
    //Upon successful login, a user's IP address and last login time are stored to check for potential sockpuppet accounts
    handleSubmit = async e => {
        e.preventDefault();
        this.setState({ loading: true });

        const response = await fetch("/users/register", {
            method: "POST",
            body: JSON.stringify(this.state),
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        if (response.status === 400) {
            //Assign validation error messages to new object
            let errors = {};
            Object.keys(data).forEach(key => errors[key] = getError(data[key]).message);

            this.setState({ errors: errors });
        }
        else if (response.status === 200) {
            this.setState(this.initialState);
            NotificationManager.success("Account created successfully", "Account Registered");
        } else {
            showError(data.error);
        }

        this.setState({ loading: false });
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