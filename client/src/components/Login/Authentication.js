import React from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

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
            errors: {}
        };
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit = e => {
        e.preventDefault();
        const self = this;
        fetch("/users/login", {
            method: "POST",
            body: JSON.stringify(this.state),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(function (response) {
                if (response.status !== 200) {
                    response.json().then(function (data) {
                        self.setState({ errors: data });
                    });
                }
            })
            .catch(error => console.error("Error:", error));
    }

    render() {
        return (
            <Container>
                <Row className="justify-content-md-center">
                    <Col md="10">
                        <img src={Logo} alt="logo" className="loginLogo" />
                        <Form noValidate onSubmit={this.handleSubmit}>
                            <Form.Group controlID="usernameFormGroup" className="text-left text-white">
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
                            <Form.Group controlID="passwordFormGroup" className="text-left text-white">
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
                            <Form.Group>
                                <Button variant="outline-light" type="submit" block>
                                    Login
                                </Button>
                            </Form.Group>
                            <Form.Group>
                                <Link to="/" className="text-white"> ← Go back to previous page</Link>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Container>
        );
    };
}

export default Authentication;