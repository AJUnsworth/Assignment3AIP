import React from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import { withRouter } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import Form from "react-bootstrap/Form";

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
            formData.append("postId", this.props.post._id)
            this.editPost(formData);
        } else {
            this.createPost(formData);
        }
    }

    createPost(formData) {
        this.setState({ loading: true });
        const self = this;
        fetch('/post/create',
            {
                method: 'POST',
                body: formData
            }).then(function (response) {
                if (response.status === 200) {
                    response.json().then(post => {
                        if (post.flagged) {
                            NotificationManager.warning("This post may contain text or innapropriate content and requires approval before it can be viewed", "Flagged Post");
                        } else {
                            NotificationManager.success("Your image has been posted!", "Post successful");
                        }
                        self.setState(self.initialState);
                        self.props.handleNewPosts();
                    });
                } else {
                    self.setState({ loading: false });
                    NotificationManager.error(
                        "Looks like something went wrong while creating a post, please try again later",
                        "Error creating post",
                        5000
                    );
                }
            });
    }

    editPost(formData) {
        this.setState({ loading: true });
        const self = this;
        fetch('/post/edit',
            {
                method: 'POST',
                body: formData
            }).then(function (response) {
                if (response.status === 200) {
                    response.json().then(data => {
                        self.setState(self.initialState);
                        if (data.flagged) {
                            self.props.history.push("/");
                            NotificationManager.warning("This post may contain text or innapropriate content and requires approval before it can be viewed", "Flagged Post");
                        } else {
                            self.props.handleUpdatePost(data);
                            NotificationManager.success("Your image has been updated!", "Post successful");
                        }
                    });
                } else if (response.status === 405) {
                    self.setState({ loading: false });
                    NotificationManager.error(
                        "Looks like someone has already reacted or replied to this post",
                        "Cannot edit post",
                        5000
                    );
                } else if (response.status === 400) {
                    self.setState({ loading: false });
                    NotificationManager.error(
                        "Please only upload .jpg, .png or .gif files",
                        "Cannot upload post",
                        5000
                    );
                } else {
                    self.setState({ loading: false });
                    NotificationManager.error(
                        "Looks like something went wrong when trying to edit this post, please try again later",
                        "Error editing post",
                        5000
                    );
                }
            })
    }

    renderUploadButton() {
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
                                {this.renderUploadButton()}
                            </Button>
                        </Form.Group>
                    </div>
                </Col>
            </div>
        );
    }

}

export default withRouter(UploadImageForm);