import React from "react";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';
import ErrorImage from "../../images/404.png";

import Navbar from "../Navbar/Navbar";
import '../MissingPage/MissingPage.css'

//Generic page shown for non-existent URLS or URLs that could not be found
class User extends React.Component {

    render() {
        return (
            <div>
                <Navbar {...this.props} />
                <Row className="align-items-center">
                <Col className="verticalColPadding textCentred">
                    <img src={ErrorImage} alt="error" className="errorImage"></img>
                    <Link to="/" ><Button variant="info">Go Home</Button></Link>
                </Col>
                </Row>
            </div>
        );
    }
}

export default User;