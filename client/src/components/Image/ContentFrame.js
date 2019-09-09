import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Leaderboard from "../Leaderboard/Leaderboard";
import ProfilePicture from "../User/ProfilePicture";
import ImageGrid from "./ImageGrid";
import "./ContentFrame.css";

// Containment Function - taken from React.js.org documentation
// https://reactjs.org/docs/composition-vs-inheritance.html

function ContentFrame(props) {
    return (
        <Container className="contentFrame">
            <Row>
                <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                    <h1 className="welcomeMessage">Welcome {props.username}</h1>
                    <h4>Start a new conversation today</h4>
                </Col>
                <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                    <ProfilePicture/>
                </Col>
                    
            </Row>
            <Row>
                <Col xs={12} sm={12} md={8} lg={8} xl={8} className="contentFrameGrid"><ImageGrid/></Col>
                <Col xs={12} sm={12} md={4} lg={4} xl={4}><Leaderboard/></Col>
            </Row>
        </Container>
    );
}

export default ContentFrame;