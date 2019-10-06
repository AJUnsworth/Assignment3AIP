import React from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Leaderboard from "../Leaderboard/Leaderboard";
import ImageGrid from "./ImageGrid";
import "./ContentFrame.css";
import ImageActionsButton from "../User/Admin/ImageActionsButton";

// Containment Function - taken from React.js.org documentation
// https://reactjs.org/docs/composition-vs-inheritance.html

function ContentFrame(props) {
    return (
        <Container className="contentFrame">
            <Row>
                <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                    <h1 className="welcomeMessage">
                        Welcome&nbsp;
                        <Link to={props.currentUser ? "/user/" + props.currentUser.id : "/login"}>
                            {props.currentUser ? props.currentUser.username : ""}
                        </Link>
                    </h1>
                    <h4>Start a new conversation today</h4>
                    <ImageActionsButton/>
                </Col>

            </Row>
            <Row>
                <Col xs={12} sm={12} md={8} lg={8} xl={8} className="contentFrameGrid">
                    <ImageGrid {...props} />
                </Col>
                <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                    <Leaderboard {...props} />
                </Col>
            </Row>
        </Container>
    );
}

export default ContentFrame;