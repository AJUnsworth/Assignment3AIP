import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";

import Navbar from "../Navbar/Navbar";
import ThreadImage from "./ThreadImage";
import ProfilePicture from "../User/ProfilePicture";
import ImageGrid from "../Image/ImageGrid";
import ReactionGrid from "./ReactionGrid";
import "./Thread.css";

class Thread extends React.Component {

    constructor() {
        super();
        this.state = {
            post: {},
            replies: []
        }
    }

    componentDidMount() {
        const self = this;
        console.log(this.props.postId);
        const { postId } = this.props.match.params;
        fetch("/post/" + postId, {
            method: "GET"
        })
            .then(function(response) {
                console.log(response.body);
                response.json().then(function (data) {
                    self.setState({ post: data });
                })
            })
    }

    displayReplies = () => {
        //Todo: Currently throws an exception but still works as expected, need to look into this further
        const self = this;
        const { postId } = this.props.match.params;
        fetch("/post/replies?post_id=" + postId, {
            method: "GET"
        })
            .then(function (response) {
                if (response.status === 404) {
                    self.setState({replies: []});
                }
                else if (response.status === 200) {
                    console.log(response);
                    response.json().then(function (data) {
                        console.log(...data);
                        self.setState(prevState => ({
                            replies: [...prevState.replies, ...data],
                            //isShowMoreDisabled: prevState.replies.length + data.length === data.metadata[0].totalCount
                        }));
                    });
                }
            })
    }

    render() {
        return (
            <div>
                <Navbar />
                <div className="content">
                    <Row className="threadTop">
                        <Col lg="8" className="threadImg">
                            <ThreadImage imageUrl={this.state.post.imageUrl}/>
                        </Col>
                        <Col lg="4" className="threadDesc">
                            <ProfilePicture className="profilePicture" />
                            <h1 className="profileName">Post by</h1>
                            <h1 className="profileName">johnsmith123</h1>
                            <ReactionGrid post={this.state.post} className="reactionGrid" />
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
                                <ImageGrid displayPosts={this.displayReplies} replyTo={this.state.post} posts={this.state.replies} />
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default Thread;