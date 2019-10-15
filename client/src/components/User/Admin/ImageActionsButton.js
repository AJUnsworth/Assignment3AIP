import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { NotificationManager } from "react-notifications";
import { withRouter } from "react-router-dom";

import { showError } from "../../../errors";

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

    handleApprove = async () => {
        this.setState({ showApprove: false });

        const requestBody = JSON.stringify({
            postId: this.props.post._id
        });

        const response = await fetch("/post/approve", {
            method: "POST",
            body: requestBody,
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.status === 200) {
            NotificationManager.success("Post has been approved successfully", "Approved");
            this.props.history.push("/admin");
        } else {
            const data = await response.json();
            showError(data.error);
        }
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