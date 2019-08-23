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
    render() {
        return (
            <Container>
                <Row>
                    <h1 className="titlePadding">Register for an account today!</h1>
                </Row>
                <Row>
                    <Col md="4">
                        <Form.Group>
                            <Form.Label>First name</Form.Label>
                            <Form.Control type="text" placeholder="Enter first name"></Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md="4">
                        <Form.Group>
                            <Form.Label>Last name</Form.Label>
                            <Form.Control type="text" placeholder="Enter last name"></Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md="6">
                        <Form>
                            <Form.Group controlID="emailFormGroup">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" />
                            </Form.Group>
                            <Form.Group controlID="passFormGroup">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" />
                            </Form.Group>
                            <Form.Group controlID="confirmPassFormGroup">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" />
                            </Form.Group>
                            <Form.Group>
                                <Button variant="primary" type="submit">
                                    Register Account
                                    </Button>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Container>
        );
    };
}

export default Registration;