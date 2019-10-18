import React from "react";
import { NotificationManager } from "react-notifications";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import { showError } from "../../errors";
import ActionModal from "../ActionModal/ActionModal";
import ImageActionsButton from "../User/Admin/ImageActionsButton";
import Navbar from "../Navbar/Navbar";
import ThreadImage from "./Modules/ThreadImage";
import ImageGrid from "../ImageGrid/ImageGrid";
import ReactionGrid from "./Modules/ReactionGrid";
import "./Thread.css";
import ReplyBreadcrumb from "./Modules/ReplyBreadcrumb";
import UploadImageForm from "../ImageGrid/Functions/UploadImageForm";


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

        const response = await fetch(`/posts/${postId}`, {
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
        const response = await fetch("/users/checkAdmin");

        if (response.status !== 200) {
            this.props.history.push("/");
        }
    }

    handleShowReport = () => {
        this.setState({ showReport: !this.state.showReport });
    }

    handleShowDelete = (e) => {
        this.setState({ showDelete: !this.state.showDelete });
    }

    handleShowEdit = () => {
        this.setState({ showEdit: !this.state.showEdit });
    }

    handleUpdatePost = (updatedPost) => {
        this.setState({ post: updatedPost });
    }

    //Gives users ability to report posts
    //After 20 reports, the post is flagged and users will be directed to home page if they try to view
    handleReportPost = async () => {
        const response = await fetch(`/posts/${this.state.post._id}/report`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.status === 200) {
            const contentType = response.headers.get("content-type");
            if (contentType.includes('application/json')) {
                const data = await response.json();
                if (data.flagged) {
                    this.props.history.push("/");
                    NotificationManager.success("Post has been been flagged for containing text or innapropriate content", "Post reported");
                }
            } else {
                NotificationManager.success("The post has been reported successfully", "Post Reported");
            }
        }
        else {
            const data = await response.json();
            showError(data.error);
        }

        this.setState({ showReport: false });
    }

    handleReactionUpdate = (reactions) => {
        this.setState(prevState => ({
            post: {
                ...prevState.post,
                reactions: reactions
            }
        }));
    }

    // Deletes post and redirects to home page if there are no reactions/replies
    // Removes imageUrl if post is deleted with reactions/replies
    handleDeletePost = async () => {
        this.setState({ showDelete: false });

        const requestBody = JSON.stringify({
            postId: this.state.post._id
        });

        const response = await fetch(`/posts/${this.state.post._id}/delete`, {
            method: "POST",
            body: requestBody,
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.status === 200) {
            //Code to check if response is JSON
            //See https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Headers
            const contentType = response.headers.get("content-type");
            if (contentType.includes('application/json')) {
                const data = await response.json()
                this.setState({ post: data });
                NotificationManager.success("Post image removed successfully", "Post image deleted");
            } else {
                NotificationManager.success("Post removed successfully", "Post deleted");
                this.props.history.push("/");
            }
        } else {
            const data = await response.json();
            showError(data.error);
        }
    }

    //Displays replies to the post
    displayReplies = async (refresh, method) => {
        let skippedPosts;
        const { postId } = this.props.match.params;
        this.setState({ loadingReplies: true });

        if (!refresh) {
            skippedPosts = this.state.replies.length;
        } else {
            skippedPosts = 0;
        }

        const response = await fetch(`/posts/${postId}/${method}?skippedPosts=${skippedPosts}`);

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
                    isShowMoreDisabled: data.results.length < 10
                });
            }
        } else {
            showError(data.error);
        }

        this.setState({ loadingReplies: false });
    }

    displayFlagged = () => {
        if (this.state.post.flagged) {
            return (
                <h5 className="text-danger">Note: This post has been flagged as it contains text or inappropriate content</h5>
            );
        }
    }

    //Renders Breadcrumb that displays parent threads of posts
    renderBreadcrumb() {
        if (this.state.post.replyTo) {
            return (
                <ReplyBreadcrumb post={this.state.post} />
            );
        }
    }

    //Renders buttons to react and report to image. Users who created the image can also delete or replace the image.
    renderQuickActions() {
        const post = this.state.post;
        const currentUser = this.props.currentUser;

        if (currentUser && post.imageUrl) {
            let showApprove = false;
            let showDelete = false;
            let showEdit = false;
            let showReport = false;

            if (post.user._id === currentUser.id) {
                showDelete = true;
                showEdit = !post.totalReplies
                    && post.reactions.like === 0
                    && post.reactions.love === 0
                    && post.reactions.tears === 0
                    && post.reactions.angry === 0
                    && post.reactions.laugh === 0
                    && post.reactions.wow === 0;
            } else {
                showReport = !currentUser.isAdmin;
            }
            showApprove = post.flagged && currentUser.isAdmin;

            return (
                <div className="quickActions">
                    <h6>Quick Actions</h6>
                    <ButtonGroup>
                        {showDelete &&
                            <Button onClick={this.handleShowDelete} name="delete" variant="danger">Delete</Button>
                        }
                        {showEdit &&
                            <Button onClick={this.handleShowEdit} variant="info">Replace Image</Button>
                        }
                        {showApprove &&
                            <ImageActionsButton {...this.props} {...this.state} />
                        }
                        {showReport &&
                            <Button onClick={this.handleShowReport} variant="danger">Report Image</Button>
                        }
                    </ButtonGroup>
                </div>
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
                            <h1 className="profileName"><Link to={"/user/" + user._id}>{user.username}</Link></h1>
                            <ReactionGrid post={this.state.post} currentUser={this.props.currentUser} className="reactionGrid" handleReactionUpdate={this.handleReactionUpdate} />
                            {this.displayFlagged()}
                            {this.renderQuickActions()}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className="comments">
                                <h2 className="commentLabel">Comments</h2>
                                <ImageGrid
                                    displayPosts={this.displayReplies}
                                    sortBy='latest'
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
        let deleteMessage;
        if (this.state.post.totalReplies) {
            deleteMessage = "This post will be replaced by a placeholder as there are existing replies. Are you sure you want to remove this image?";
        } else {
            deleteMessage = "Are you sure you want to delete this post? This action cannot be reversed.";
        }

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
                    {this.renderThread()};

                    <ActionModal
                        show={this.state.showDelete}
                        handleShowModal={this.handleShowDelete}
                        title={"Delete Post"}
                        handleModalAction={this.handleDeletePost}
                        modalActionText={"Delete"}
                    >
                        {deleteMessage}
                    </ActionModal>

                    <ActionModal
                        show={this.state.showEdit}
                        handleShowModal={this.handleShowEdit}
                        title={"Edit Post"}
                    >
                        <h5>Select an image to replace your post</h5>
                        <UploadImageForm
                            currentUser={this.props.currentUser}
                            post={this.state.post}
                            handleUpdatePost={this.handleUpdatePost}
                        />
                    </ActionModal>

                    <ActionModal
                        show={this.state.showReport}
                        handleShowModal={this.handleShowReport}
                        title={"Report Post"}
                        handleModalAction={this.handleReportPost}
                        modalActionText={"Report"}
                    >
                        <h5>Are you sure you want to proceed?</h5>
                        <p>Posts containing text, violent or sexual content are not permitted on this site. If this post is in violation of these standards, please click report.</p>
                    </ActionModal>
                </div>
            );
        }
    }
}

export default Thread;