import React from "react";
import { withRouter, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import PropTypes from 'prop-types';

import { showError, getError } from "../../../errors";
import Logo from "../../../../src/images/Seenit Logo_white.png";
import "./LoginForm.css";

// Form uses skeleton code & logic from React Bootstrap Documentation
// https://react-bootstrap.github.io/components/forms/#forms-validation-native

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            errors: {},
            loading: false
        };
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

        const response = await fetch("/users/login", {
            method: "PUT",
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
        } else if (response.status === 200) {
            //Set the current user throughout the application and push the user to the homepage
            this.props.setUser(data);
            this.props.history.push("/");
        } else {
            showError(data.error);
        }

        this.setState({ loading: false });
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
                                    {this.state.loading ?
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
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

LoginForm.propTypes = {
    setUser: PropTypes.func,
    logout: PropTypes.func
};

export default withRouter(LoginForm);