import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { NotificationManager } from "react-notifications";
import { withRouter } from "react-router-dom";
import PropTypes from 'prop-types';

import { showError } from "../../../errors";

//Allows admins to approve flagged posts
//Once post is approved, it can be displayed on the home page
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

        const response = await fetch(`/posts/${this.props.post._id}/approve`, {
            method: "PUT",
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

ImageActionsButton.propTypes = {
    post: PropTypes.object.isRequired
};

export default withRouter(ImageActionsButton);