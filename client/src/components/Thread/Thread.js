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

import ImageActionsButton from "../User/Admin/ImageActionsButton";
import Navbar from "../Navbar/Navbar";
import ThreadImage from "./ThreadImage";
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
            showReport: false,
            loading: true,
            loadingReplies: true,
            isShowMoreDisabled: false,
        }
    }

    componentDidMount() {
        const self = this;
        const { postId } = this.props.match.params;
        fetch("/post/" + postId, {
            method: "GET"
        })
            .then(function (response) {
                if (response.status === 404) {
                    self.props.history.push("/");
                }
                response.json().then(function (data) {
                    if (data.flagged) {
                        fetch("/users/checkAdmin")
                            .then(res => {
                                if (res.status !== 200) {
                                    self.props.history.push("/");
                                }
                            });
                    }
                    self.setState({ post: data, loading: false });
                })
            })
    }

    handleShowReport = () => {
        this.setState({ showReport: true });
    }

    handleCloseReport = () => {
        this.setState({ showReport: false });
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

    handleReportImage = () => {
        const self = this;
        const requestBody = JSON.stringify({ postId: this.state.post._id, userId: this.props.currentUser.id })

        fetch("/post/report", {
            method: "POST",
            body: requestBody,
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(function (response) {
                if (response.status === 200) {
                    NotificationManager.success("The post has been reported successfully", "Post Reported");
                }
                else if (response.status === 405) {
                    NotificationManager.error("You have already reported this post", "Report Unsuccessful");
                }
                else {
                    NotificationManager.error("An error has occured.", "Error");
                }
                self.setState({ showReport: false });
            })
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

    displayRecentReplies = (refresh) => {
        const self = this;
        let skippedPosts;
        const { postId } = this.props.match.params;
        this.setState({ loadingReplies: true });

        if (!refresh) {
            skippedPosts = this.state.replies.length;
        } else {
            skippedPosts = 0;
        }

        fetch(`/post/repliesRecent?postId=${postId}&skippedPosts=${skippedPosts}`)
            .then(function (response) {
                if (response.status === 404) {
                    response.json().then(function (data) {
                        //self.setState({ errors: data });
                    });
                }
                else if (response.status === 200) {
                    response.json().then(function (data) {
                        if (!refresh) {
                            self.setState(prevState => ({
                                replies: [...prevState.replies, ...data.results],
                                isShowMoreDisabled: prevState.replies.length + data.results.length === data.metadata[0].totalCount,
                                loadingReplies: false
                            }));

                        } else {
                            self.setState({
                                replies: data.results,
                                isShowMoreDisabled: data.results.length < 10,
                                loadingReplies: false
                            });
                        }
                    });
                }
            })
    }

    displayFlagged = () => {
        if (this.state.post.flagged) {
            return (
                <h5 className="text-danger">Note: This post has been flagged as it contains text or inappropriate content</h5>
            );
        }
    }

    displayPopularReplies = (refresh) => {
        const self = this;
        let skippedPosts;
        const { postId } = this.props.match.params;
        this.setState({ loadingReplies: true });

        if (!refresh) {
            skippedPosts = this.state.replies.length;
        } else {
            skippedPosts = 0;
        }

        fetch(`/post/repliesPopular?postId=${postId}&skippedPosts=${skippedPosts}`)
            .then(function (response) {
                if (response.status === 404) {
                    response.json().then(function (data) {
                        //self.setState({ errors: data });
                    });
                }
                else if (response.status === 200) {
                    response.json().then(function (data) {
                        if (!refresh) {
                            self.setState(prevState => ({
                                replies: [...prevState.replies, ...data.results],
                                isShowMoreDisabled: prevState.replies.length + data.results.length === data.metadata[0].totalCount,
                                loadingReplies: false
                            }));

                        } else {
                            self.setState({
                                replies: data.results,
                                isShowMoreDisabled: data.results.length < 10,
                                loadingReplies: false
                            });
                        }
                    });
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
        if (this.props.currentUser) {
            if (this.props.currentUser.isAdmin) {
                return (
                    <div className="quickActions">
                        <h6>Quick Actions</h6>
                        <ImageActionsButton handleDeletePost={this.handleDeletePost} {...this.props} {...this.state} />
                    </div>
                );
            } else if (post.userId._id === this.props.currentUser.id) {
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
            else {
                return (
                    <div className="quickActions">
                        <h6>Quick Actions</h6>
                        <ButtonGroup>
                            <Button onClick={this.handleShowReport} variant="secondary">Report Image</Button>
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
                    <Row xs={12} sm={12} md={12} lg={12} xl={12}>
                        {this.renderBreadcrumb()}
                    </Row>
                    <Row className="threadTop">
                        <Col xs={12} sm={12} md={12} lg={8} xl={8} className="threadImg">
                            <ThreadImage imageUrl={this.state.post.imageUrl} />
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={4} xl={4} className="threadDesc">
                            <h1 className="profileName">Post by</h1>
                            <h1 className="profileName"><Link to={"/user/" + user._id}>{user.username}</Link></h1>
                            <ReactionGrid post={this.state.post} currentUser={this.props.currentUser} className="reactionGrid" />
                            {this.displayFlagged()}
                            {this.renderQuickActions()}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className="comments">
                                <h2 className="commentsText">Comments</h2>
                                <ImageGrid displayRecentReplies={this.displayRecentReplies}
                                    displayPopularReplies={this.displayPopularReplies}
                                    sortBy='repliesRecent'
                                    replyTo={this.state.post}
                                    posts={this.state.replies}
                                    currentUser={this.props.currentUser}
                                    loading={this.state.loadingReplies}
                                    isShowMoreDisabled={this.state.isShowMoreDisabled}
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
                    <FontAwesomeIcon id="loading" className="fa-10x loadingIcon" icon={faSpinner} spin />
                </div>)
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

                    <Modal show={this.state.showReport} onHide={this.handleCloseReport}>
                        <Modal.Header closeButton>
                            <Modal.Title>Report Post</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <h5>Are you sure you want to proceed?</h5>
                            <p>Posts containing text, violent or sexual content are not permitted on this site. If this post is in violation of these standards, please click report.</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <ButtonGroup>
                                <Button variant="secondary" onClick={this.handleCloseEdit}>
                                    Cancel
                                </Button>
                                <Button variant="danger" onClick={this.handleReportImage}>
                                    Report
                                </Button>
                            </ButtonGroup>
                        </Modal.Footer>
                    </Modal>
                </div>
            );
        }
    }
}

export default Thread;