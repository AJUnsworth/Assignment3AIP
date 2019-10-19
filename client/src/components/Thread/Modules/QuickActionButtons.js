import React from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { NotificationManager } from "react-notifications";

import { showError } from "../../../errors";
import ActionButton from "./ActionButton";
import UploadImageForm from "../../ImageGrid/Functions/UploadImageForm";
import "./QuickActionButtons.css";

class QuickActionButtons extends React.Component {
    //Gives users ability to report posts
    //After 20 reports, the post is flagged and users will be directed to home page if they try to view
    handleReportPost = async () => {
        const response = await fetch(`/api/posts/${this.props.post._id}/report`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.status === 204) {
            NotificationManager.success("The post has been reported successfully", "Post Reported");
        } else {
            const data = await response.json();

            if (response.status === 200) {
                if (data.flagged) {
                    this.props.history.push("/");
                    NotificationManager.success("Post has been been flagged for containing text or innapropriate content", "Post reported");
                }
            } else {
                showError(data.error);
            }
        }
    }

    // Deletes post and redirects to home page if there are no reactions/replies
    // Removes imageUrl if post is deleted with reactions/replies
    handleDeletePost = async () => {
        const requestBody = JSON.stringify({
            postId: this.props.post._id
        });

        const response = await fetch(`/api/posts/${this.props.post._id}/delete`, {
            method: "DELETE",
            body: requestBody,
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.status === 204) {
            NotificationManager.success("Post removed successfully", "Post deleted");
            this.props.history.push("/");
        } else {
            const data = await response.json();

            if (response.status === 200) {
                this.props.handleUpdatePost(data);
                NotificationManager.success("Post image removed successfully", "Post image deleted");
            } else {
                showError(data.error);
            }
        }
    }

    //Removes flagged status and clears reports on a post, making them visible to any user
    handleApprovePost = async () => {
        const response = await fetch(`/api/posts/${this.props.post._id}/approve`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.status === 204) {
            NotificationManager.success("Post has been approved successfully", "Approved");
            this.props.history.push("/admin");
        } else {
            const data = await response.json();
            showError(data.error);
        }
    }

    //Renders buttons for users depending on role and whether they own the post
    renderQuickActions() {
        const post = this.props.post;
        const currentUser = this.props.currentUser;

        let deleteMessage;
        //Render delete message for modal depending on whether it can be fully deleted, or if it has replies and can only be replaced with a placeholder
        if (this.props.post.totalReplies) {
            deleteMessage = "This post will be replaced by a placeholder as there are existing replies. Are you sure you want to remove this image?";
        } else {
            deleteMessage = "Are you sure you want to delete this post? This action cannot be reversed.";
        }

        if (currentUser && post.imageUrl) {
            let showApprove, showDelete, showEdit, showReport = false;

            if (post.user._id === currentUser.id) {
                //Render delete if a user owns a post and it is not a placeholder
                showDelete = true;

                //Render edit when there are no replies or reactions, and the user owns the post and it is not a placeholder
                showEdit = !post.totalReplies
                    && post.reactions.like === 0
                    && post.reactions.love === 0
                    && post.reactions.tears === 0
                    && post.reactions.angry === 0
                    && post.reactions.laugh === 0
                    && post.reactions.wow === 0;
            } else {
                //Only render report for non-admin users on posts that aren't a placeholder
                showReport = !currentUser.isAdmin;
            }

            //Only render approve when the current user is an admin and the post has been flagged
            showApprove = post.flagged && currentUser.isAdmin;

            if (showDelete || showApprove || showEdit || showReport) {
                return (
                    <div className="quickActions">
                        <h6>Quick Actions</h6>
                        <ButtonGroup>
                            {showDelete &&
                                <ActionButton handleButtonAction={this.handleDeletePost} title={"Delete"} variant={"danger"}>
                                    {deleteMessage}
                                </ActionButton>
                            }
                            {showEdit &&
                                <ActionButton title={"Edit"} variant={"info"}>
                                    <h5>Select an image to replace your post</h5>
                                    <UploadImageForm {...this.props} />
                                </ActionButton>
                            }
                            {showApprove &&
                                <ActionButton handleButtonAction={this.handleApprovePost} title={"Approve"} variant={"secondary"}>
                                    Is this post clear of text and inappropriate content?
                            </ActionButton>
                            }
                            {showReport &&
                                <ActionButton handleButtonAction={this.handleReportPost} title={"Report"} variant={"danger"}>
                                    <h5>Are you sure you want to proceed?</h5>
                                    <p>Posts containing text, violent or sexual content are not permitted on this site. If this post is in violation of these standards, please click report.</p>
                                </ActionButton>
                            }
                        </ButtonGroup>
                    </div>
                );
            }
        }
    }

    render() {
        return (
            <>
                {this.renderQuickActions()}
            </>
        );
    }
}

QuickActionButtons.propTypes = {
    currentUser: PropTypes.object,
    post: PropTypes.object.isRequired,
    handleUpdatePost: PropTypes.func.isRequired
};

export default withRouter(QuickActionButtons);