import React from "react";
import Button from "react-bootstrap/Button";
import { NotificationManager } from "react-notifications";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import ActionModal from "../../ActionModal/ActionModal";
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

    //Display/close modal for approving posts
    handleShowApprove = () => {
        this.setState({ showApprove: !this.state.showApprove });
    }

    //Removes flagged status and clears reports on a post, making them visible to any user
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
                <Button variant="secondary" onClick={this.handleShowApprove}>Approve</Button>

                <ActionModal
                    show={this.state.showApprove}
                    handleShowModal={this.handleShowApprove}
                    title={"Confirm Approval"}
                    handleModalAction={this.handleApprove}
                    modalActionText={"Approve"}
                >
                    Is this post clear of text and inappropriate content?
                    </ActionModal>
            </>
        );

    };
}

ImageActionsButton.propTypes = {
    post: PropTypes.object.isRequired
};

export default withRouter(ImageActionsButton);