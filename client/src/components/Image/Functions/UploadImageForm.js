import React from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import { withRouter } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import Form from "react-bootstrap/Form";

import { showError } from "../../../errors";

// Upload image component is built on top of a component found online
// Source: https://mdbootstrap.com/docs/react/forms/file-input/

class UploadImageForm extends React.Component {
    constructor() {
        super()
        this.initialState = {
            imgFile: null,
            filename: "Choose file",
            activeState: true,
            loading: false
        };
        this.state = this.initialState;
    }

    handleFileBrowse = e => {
        e.preventDefault();
        // eslint-disable-next-line
        this.setState({ imgFile: e.target.files[0], filename: e.target.value.replace(/^.*[\\\/]/, '') });
        if (!e.target.value) {
            this.setState({ activeState: true });
        } else {
            this.setState({ activeState: false });
        }
    }

    handleFileUpload = () => {
        var formData = new FormData();
        formData.append("image", this.state.imgFile);
        this.setState({ activeState: true });

        if (this.props.replyTo) {
            formData.append("replyTo", this.props.replyTo._id);
            formData.append("depth", this.props.replyTo.depth + 1);
            this.createPost(formData);
        } else if (this.props.post) {
            this.editPost(formData);
        } else {
            this.createPost(formData);
        }
    }

    async createPost(formData) {
        this.setState({ loading: true });

        const response = await fetch('/post/create', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (response.status === 200) {
            if (data.flagged) {
                NotificationManager.warning("This post may contain text or innapropriate content and requires approval before it can be viewed", "Flagged Post");
            } else {
                NotificationManager.success("Your image has been posted!", "Post successful");
            }

            this.setState(this.initialState);
            this.props.handleNewPosts();
        } else {
            this.setState({ loading: false });
            showError(data.error);
        }
    }

    async editPost(formData) {
        const postId = this.props.post._id;
        this.setState({ loading: true });

        const response = await fetch(`/post/${postId}/edit`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (response.status === 200) {
            this.setState(this.initialState);
            if (data.flagged) {
                this.props.history.push("/");
                NotificationManager.warning("This post may contain text or innapropriate content and requires approval before it can be viewed", "Flagged Post");
            } else {
                this.props.handleUpdatePost(data);
                NotificationManager.success("Your image has been updated!", "Post successful");
            }
        } else {
            this.setState({ loading: false });
            showError(data.error);
        }
    }

    renderUploadText() {
        if (this.state.loading) {
            return <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>;
        } else {
            return (
                "Upload"
            );
        }
    }

    render() {
        return (
            <div xs={12} sm={12} md={12} lg={6} xl={6}>
                <Col>
                    <h6>Add a thread...</h6>
                    <div className="input-group">
                        <div className="custom-file">
                            <input
                                type="file"
                                className="custom-file-input"
                                id="inputGroupFile01"
                                accept=".png, .jpg, .gif, .jpeg"
                                aria-describedby="inpStGroupFileAddon01"
                                onChange={this.handleFileBrowse}
                            />
                            <label className="custom-file-label" htmlFor="inputGroupFile01">
                                {this.state.filename}
                            </label>
                        </div>
                        <Form.Group>
                            <Button variant="primary" id="uploadButton" type="submit" name="uploadBtn" disabled={this.state.activeState} onClick={this.handleFileUpload}>
                                {this.renderUploadText()}
                            </Button>
                        </Form.Group>
                    </div>
                </Col>
            </div>
        );
    }

}

export default withRouter(UploadImageForm);