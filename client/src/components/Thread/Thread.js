import React from "react";
import { NotificationManager } from "react-notifications";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import Navbar from "../Navbar/Navbar";
import ThreadImage from "./ThreadImage";
import ProfilePicture from "../User/ProfilePicture";
import ImageGrid from "../Image/ImageGrid";
import ReactionGrid from "./ReactionGrid";
import "./Thread.css";
import ReplyBreadcrumb from "./ReplyBreadcrumb";
import UploadImage from "../Image/UploadImage";

class Thread extends React.Component {

    constructor() {
        super();
        this.state = {
            post: {},
            replies: [],
            showDelete: false,
            showEdit: false,
            loading: true,
            loadingReplies: true
        }
    }

    componentDidMount() {
        const self = this;
        const { postId } = this.props.match.params;
        fetch("/post/" + postId, {
            method: "GET"
        })
            .then(function (response) {
                response.json().then(function (data) {
                    self.setState({ post: data, loading: false });
                })
            })
    }

    handleShowDelete = () => {
        this.setState({ showDelete: true });
    }

    handleCloseDelete = () => {
        this.setState({ showDelete: false });
    }

    handleEditPost = () => {
        this.setState({ showEdit: true });
    }

    handleCloseEdit = () => {
        this.setState({ showEdit: false });
    }

    handleUpdatePost = (updatedPost) => {
        this.setState({ post: updatedPost });
    }

    handleDeletePost = () => {
        this.setState({ showDelete: false });

        const requestBody = JSON.stringify({
            userId: this.props.currentUser.id,
            postId: this.state.post._id
        });

        const self = this;
        fetch("/post/delete", {
            method: "POST",
            body: requestBody,
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(function (response) {
                if (response.status === 200) {
                    //Code to check if response is JSON
                    //See https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Headers
                    const contentType = response.headers.get("content-type");
                    if (contentType.includes('application/json')) {
                        response.json().then(data => {
                            self.setState({ post: data });
                            NotificationManager.success("Post image removed successfully", "Post image deleted");
                        });
                    } else {
                        NotificationManager.success("Post removed successfully", "Post deleted");
                        self.props.history.push("/");
                    }
                } else if (response.status === 403) {
                    NotificationManager.error(
                        "Looks like this is someone else's post",
                        "Cannot delete post",
                        5000
                    );
                } else {
                    NotificationManager.error(
                        "Looks like something went wrong while deleting the post, please try again later",
                        "Error deleting post",
                        5000
                    );
                }
            })
    }

    displayReplies = () => {
        const self = this;
        const { postId } = this.props.match.params;
        this.setState({ loadingReplies: true });
        fetch("/post/replies?post_id=" + postId, {
            method: "GET"
        })
            .then(function (response) {
                if (response.status === 200) {
                    response.json().then(function (data) {
                        self.setState(prevState => ({
                            replies: [...prevState.replies, ...data],
                            loadingReplies: false
                            //isShowMoreDisabled: prevState.replies.length + data.length === data.metadata[0].totalCount
                        }));
                    });
                } else {
                    self.setState({ loadingReplies: false });
                    NotificationManager.error(
                        "Looks like something went wrong while loading the post, please try refreshing the page",
                        "Error loading post",
                        5000
                    );
                }
            })
    }

    renderBreadcrumb() {
        if (this.state.post.replyTo) {
            return (
                <ReplyBreadcrumb post={this.state.post} />
            );
        }
    }

    renderQuickActions() {
        const post = this.state.post;
        if (this.props.currentUser && post.userId._id === this.props.currentUser.id) {
            if (this.state.replies.length ||
                post.reactions.like > 0 ||
                post.reactions.love > 0 ||
                post.reactions.tears > 0 ||
                post.reactions.angry > 0 ||
                post.reactions.laugh > 0 ||
                post.reactions.wow > 0) {

                return (
                    <div className="quickActions">
                        <h6>Quick Actions</h6>
                        <ButtonGroup>
                            <Button onClick={this.handleShowDelete} variant="secondary">Delete</Button>
                        </ButtonGroup>
                    </div>
                );
            } else {
                return (
                    <div className="quickActions">
                        <h6>Quick Actions</h6>
                        <ButtonGroup>
                            <Button onClick={this.handleShowDelete} variant="secondary">Delete</Button>
                            <Button onClick={this.handleEditPost} variant="info">Replace Image</Button>
                        </ButtonGroup>
                    </div>
                );
            }
        }
    }

    renderThread() {
        if (this.state.loading) {
            return <FontAwesomeIcon id="loading" className="fa-10x" icon={faSpinner} spin />;
        } else {
            const user = this.state.post.userId;
            return (
                <div className="content">
                    <Row>
                        {this.renderBreadcrumb()}
                    </Row>
                    <Row className="threadTop">
                        <Col lg="8" className="threadImg">
                            <ThreadImage imageUrl={this.state.post.imageUrl} />
                        </Col>
                        <Col lg="4" className="threadDesc">
                            <ProfilePicture className="profilePicture" />
                            <h1 className="profileName">Post by</h1>
                            <h1 className="profileName"><Link to={"/user/" + user._id}>{user.username}</Link></h1>
                            <ReactionGrid post={this.state.post} currentUser={this.props.currentUser} className="reactionGrid" />
                            {this.renderQuickActions()}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className="comments">
                                <h2 className="commentsText">Comments</h2>
                                <ImageGrid displayPosts={this.displayReplies}
                                    replyTo={this.state.post}
                                    posts={this.state.replies}
                                    currentUser={this.props.currentUser}
                                    loading={this.state.loadingReplies}
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
            );
        }
    }

    render() {
        let deleteMessage;
        if (this.state.replies.length) {
            deleteMessage = "This post will be replaced by a placeholder as there are existing replies. Are you sure you want to remove this image?";
        } else {
            deleteMessage = "Are you sure you want to delete this post? This action cannot be reversed.";
        }

        if (this.state.loading) {
            return (
                <div>
                    <Navbar {...this.props} />
                    <FontAwesomeIcon id="loading" className="fa-10x" icon={faSpinner} spin /></div>)
        }
        else {
            return (
                <div>
                    <Navbar {...this.props} />

                    {this.renderThread()};

                    <Modal show={this.state.showDelete} onHide={this.handleCloseDelete}>
                        <Modal.Header closeButton>
                            <Modal.Title>Delete Post</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>{deleteMessage}</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleCloseDelete}>
                                Cancel
                        </Button>
                            <Button variant="primary" onClick={this.handleDeletePost}>
                                Delete
                        </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={this.state.showEdit} onHide={this.handleCloseEdit}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Post</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <h5>Select an image to replace your post</h5>
                            <UploadImage
                                currentUser={this.props.currentUser}
                                post={this.state.post}
                                handleUpdatePost={this.handleUpdatePost}
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={this.handleCloseEdit}>
                                Close
                        </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            );
        }
    }
}

export default Thread;