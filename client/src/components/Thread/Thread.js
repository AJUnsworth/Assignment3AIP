import React from 'react';
import Navbar from '../Navbar/Navbar';
import ThreadImage from './ThreadImage';
import ProfilePicture from '../User/ProfilePicture';
import ImageGrid from '../Image/ImageGrid';
import ReactionGrid from './ReactionGrid';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import './Thread.css';

class Thread extends React.Component {
    render () {
        return (
            <div>
                <Navbar />
                <div className="content">
                    <Row className="threadTop">
                        <Col lg="8" className="threadImg"><ThreadImage/></Col>
                        <Col lg="4" className="threadDesc">
                            <ProfilePicture className="profilePicture" />
                            <h1 className="profileName">Post by</h1>
                            <h1 className="profileName">johnsmith123</h1>
                            <ReactionGrid class="reactionGrid" />
                            <div className="quickActions">
                                <h6>Quick Actions</h6>
                                <ButtonGroup>
                                    <Button variant="secondary">Delete</Button>
                                    <Button variant="info">Replace Image</Button>
                                </ButtonGroup>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className="comments">
                                <h2 className="commentsText">Comments</h2>
                                <ImageGrid />
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default Thread;