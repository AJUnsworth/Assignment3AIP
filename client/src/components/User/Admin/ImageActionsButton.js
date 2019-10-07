import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { NotificationManager } from "react-notifications";
import { withRouter } from "react-router-dom";

class ImageActionsButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showApprove: false,
        }
    }

    handleShowApprove = () => {
        this.setState({ showApprove: true });
    }

    handleCloseApprove = () => {
        this.setState({ showApprove: false });
    }

    handleApprove = () => {
        this.setState({ showApprove: false });

        const requestBody = JSON.stringify({
            userId: this.props.currentUser.id,
            postId: this.props.post._id
        });

        const self = this;
        fetch("/post/approve", {
            method: "POST",
            body: requestBody,
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(function (response) {
                if (response.status === 200) {
                    NotificationManager.success("Post has been successfully approved", "Approved");
                    self.props.history.push("/admin");
                } else if (response.status === 403) {
                    NotificationManager.error(
                        "Looks like you don't have permission to approve this",
                        "Cannot approve post",
                        5000
                    );
                } else {
                    NotificationManager.error(
                        "Looks like something went wrong while approving the post, please try again later",
                        "Error approving post",
                        5000
                    );
                }
            })
    }

    render() {
        return (
            <>
                {this.props.post.flagged &&
                    <Button variant="secondary" onClick={this.handleShowApprove}>Approve</Button>}

                <Modal show={this.state.showApprove} onHide={this.handleCloseApprove}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Approval</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Is this post clear of text and inappropriate content?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleCloseShow}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.handleApprove}>
                            Approve
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );

    };
}

export default withRouter(ImageActionsButton);