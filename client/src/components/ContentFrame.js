import React from 'react';
import './ContentFrame.css';
import { Leaderboard } from './Leaderboard';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ImageGrid } from './ImageGrid';

// Containment Function - taken from React.js.org documentation
// https://reactjs.org/docs/composition-vs-inheritance.html

export function ContentFrame() {
    return (
        <Container className="contentFrame">
            <Row>
                <Col md={9}><ImageGrid/></Col>
                <Col md={3}><Leaderboard/></Col>
            </Row>
        </Container>
    );
}
