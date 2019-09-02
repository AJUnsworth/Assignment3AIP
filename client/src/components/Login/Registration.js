import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './Registration.css';

// Form uses skeleton code & logic from React Bootstrap Documentation
// https://react-bootstrap.github.io/components/forms/#forms-validation-native

class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            errors: {}
        };
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit = e => {
        e.preventDefault();
        const self = this;
        fetch('/users/register', {
            method: "POST",
            body: JSON.stringify(this.state),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(function(response) {
                if(response.status === 400) {
                    response.json().then(function(data) {
                        console.log(data);
                        self.setState({ errors: data });
                        console.log(self.state.errors);
                    });
                }
                else if (response.status === 200) {
                    self.setState({ errors: {} });
                }
            })
            .then(response => console.log("Success:", JSON.stringify(response)))
            .catch(error => console.error('Error:', error));
    }

    render() {
        return (
            <Container>
                <Row>
                    <h1 className="titlePadding">Register for an account today!</h1>
                </Row>
                <Form noValidate onSubmit={this.handleSubmit}>
                    <Row>
                        <Col md="4">
                            <Form.Group>
                                <Form.Label>First name</Form.Label>
                                <Form.Control 
                                    type="text"
                                    name="firstName" 
                                    placeholder="Enter first name"
                                    onChange={this.handleChange}
                                    isInvalid={this.state.errors.firstName}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {this.state.errors.firstName}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md="4">
                            <Form.Group>
                                <Form.Label>Last name</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="lastName"
                                    placeholder="Enter last name"
                                    onChange={this.handleChange}
                                    isInvalid={this.state.errors.lastName}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {this.state.errors.lastName}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="6">
                            <Form.Group controlID="emailFormGroup">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    name="email"
                                    placeholder="Enter email" 
                                    onChange={this.handleChange}
                                    isInvalid={this.state.errors.email}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {this.state.errors.email}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlID="passFormGroup">
                                <Form.Label>Password</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    name="password"
                                    placeholder="Password"
                                    onChange={this.handleChange}
                                    isInvalid={this.state.errors.password}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {this.state.errors.password}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlID="confirmPassFormGroup">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control 
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Password"
                                    onChange={this.handleChange}
                                    isInvalid={this.state.errors.confirmPassword}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {this.state.errors.confirmPassword}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group>
                                <Button variant="primary" type="submit">
                                    Register Account
                                </Button>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Container>
        );
    };
}

export default Registration;