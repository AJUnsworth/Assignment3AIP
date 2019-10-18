import React from "react";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

import { showError } from "../../errors";
import Navbar from "../Navbar/Navbar";
import ThreadImage from "./Modules/ThreadImage";
import ImageGrid from "../ImageGrid/ImageGrid";
import ReactionGrid from "./Modules/ReactionGrid";
import ReplyBreadcrumb from "./Modules/ReplyBreadcrumb";
import QuickActionButtons from "./Modules/QuickActionButtons";
import "./Thread.css";


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
            isShowMoreDisabled: false
        }
    }

    //Displays requested post on thread page. 
    //If post does not exist, redirects user to home page
    async componentDidMount() {
        const { postId } = this.props.match.params;

        const response = await fetch(`/api/posts/${postId}`, {
            method: "GET"
        });

        if (response.status === 404) {
            this.props.history.push("/");
        } else {
            const data = await response.json();

            if (data.flagged) {
                this.checkAdmin();
            }

            this.setState({ post: data, loading: false });
        }
    }

    //If post is flagged, only admin can view. 
    //If non-admin views flagged post, redirect to home
    async checkAdmin() {
        const response = await fetch("/api/users/checkAdmin");

        if (response.status !== 200) {
            this.props.history.push("/");
        }
    }

    //Update post after being edited
    handleUpdatePost = (updatedPost) => {
        this.setState({ post: updatedPost });
    }

    //Update posts reactions whenever the reaction is used I.e. Liking a post
    handleReactionUpdate = (reactions) => {
        this.setState(prevState => ({
            post: {
                ...prevState.post,
                reactions: reactions
            }
        }));
    }

    //Displays replies to the post
    displayReplies = async (refresh, method) => {
        let skippedPosts;
        const limit = 10;
        const { postId } = this.props.match.params;
        this.setState({ loadingReplies: true });

        if (!refresh) {
            skippedPosts = this.state.replies.length;
        } else {
            skippedPosts = 0;
        }

        const response = await fetch(`/api/posts/${postId}/${method}?skippedPosts=${skippedPosts}&limit=${limit}`);

        const data = await response.json();

        if (response.status === 200) {
            if (!refresh) {
                this.setState(prevState => ({
                    replies: [...prevState.replies, ...data.results],
                    isShowMoreDisabled: prevState.replies.length + data.results.length === data.metadata[0].totalCount
                }));
            } else {
                this.setState({
                    replies: data.results,
                    isShowMoreDisabled: data.results.length < limit
                });
            }
        } else {
            showError(data.error);
        }

        this.setState({ loadingReplies: false });
    }

    //Display warning text to admin to note if a post has been flagged
    displayFlagged = () => {
        if (this.state.post.flagged) {
            return (
                <h5 className="text-danger">Note: This post has been flagged as it contains text or inappropriate content</h5>
            );
        }
    }

    //Renders Breadcrumb that displays parent threads of the current post
    //Only renders if the post is a reply
    renderBreadcrumb() {
        if (this.state.post.replyTo) {
            return (
                <ReplyBreadcrumb post={this.state.post} />
            );
        }
    }

    //Renders the post itself in the thread.
    renderThread() {
        const showUpload = this.state.post.imageUrl ? true : false;

        if (this.state.loading) {
            return <FontAwesomeIcon id="loading" className="fa-10x loadIconColor" icon={faSpinner} spin />;
        } else {
            const user = this.state.post.user;
            return (
                <div className="content">
                    <Row xs={12} sm={12} md={12} lg={12} xl={12}>
                        {this.renderBreadcrumb()}
                    </Row>
                    <Row className="threadTop">
                        <Col xs={12} sm={12} md={12} lg={8} xl={8} className="threadImg">
                            <ThreadImage imageUrl={this.state.post.imageUrl} />
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={4} xl={4} className="threadActions">
                            <h1 className="profileName">Post by</h1>
                            <h1 className="profileName">
                                <Link to={"/user/" + user._id}>
                                    {user.username}
                                </Link>
                            </h1>
                            <ReactionGrid className="reactionGrid" post={this.state.post} {...this.props} handleReactionUpdate={this.handleReactionUpdate} />
                            {this.displayFlagged()}
                            <QuickActionButtons {...this.props} post={this.state.post} handleUpdatePost={this.handleUpdatePost} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className="comments">
                                <h2 className="commentLabel">Comments</h2>
                                <ImageGrid
                                    displayPosts={this.displayReplies}
                                    sortBy="latest"
                                    replyTo={this.state.post}
                                    posts={this.state.replies}
                                    currentUser={this.props.currentUser}
                                    loading={this.state.loadingReplies}
                                    isShowMoreDisabled={this.state.isShowMoreDisabled}
                                    showUpload={showUpload}
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
            );
        }
    }

    render() {
        if (this.state.loading) {
            return (
                <div>
                    <Navbar {...this.props} />
                    <FontAwesomeIcon id="loading" className="fa-10x loadIconColor loadingIcon" icon={faSpinner} spin />
                </div>)
        }
        else {
            return (
                <div>
                    <Navbar {...this.props} />
                    {this.renderThread()}
                </div>
            );
        }
    }
}

Thread.propTypes = {
    currentUser: PropTypes.object,
    logout: PropTypes.func
};

export default Thread;