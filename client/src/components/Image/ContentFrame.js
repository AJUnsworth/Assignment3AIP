import React from 'react';
import './ContentFrame.css';
import Leaderboard from '../Leaderboard/Leaderboard';
import Welcome from '../Welcome';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ImageGrid from './ImageGrid';

// Containment Function - taken from React.js.org documentation
// https://reactjs.org/docs/composition-vs-inheritance.html

export function ContentFrame(props) {
    return (
        <Container className="contentFrame">
            <Row>
                <Welcome/>
            </Row>
            <Row>
                <Col md={9} className="contentFrameGrid"><ImageGrid/></Col>
                <Col md={3}><Leaderboard members={props.members}/></Col>
            </Row>
        </Container>
    );
}

export default ContentFrame;