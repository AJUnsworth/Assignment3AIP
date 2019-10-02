import React from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import { NotificationManager } from "react-notifications";
import Form from "react-bootstrap/Form";

class UploadImage extends React.Component {
    constructor() {
        super()
        this.initialState = {
            imgFile: null,
            filename: "Choose file",
            activeState: true
        };
        this.state = this.initialState;
    }

    handleFileBrowse = e => {
        e.preventDefault();
        // eslint-disable-next-line
        this.setState({ imgFile: e.target.files[0], filename: e.target.value.replace(/^.*[\\\/]/, '') });
        this.setState({activeState: false});
    }

    handleFileUpload = () => {
        const self = this;
        const userId = JSON.parse(localStorage.getItem("User")).id;
        var formData = new FormData();
        formData.append("image", this.state.imgFile);
        formData.append("userId", userId);
        this.setState({activeState: true});

        if (this.props.replyTo) {
            formData.append("replyTo", this.props.replyTo._id);
        }

        fetch('/post/create',
            {
                method: 'POST',
                body: formData
            }).then(function (response) {

                if (response.status === 400) {
                    response.json().then(function (data) {
                        //self.setState({ errors: data });
                    });
                }
                else if (response.status === 200) {
                    self.setState(self.initialState);
                    NotificationManager.success("Your image has been posted!", "Post successful");
                }
            })
            .catch(error => console.error("Error:", error));
        this.setState({activeState: false});
    }

    render() {
        return (
            <div xs={12} sm={12} md={12} lg={6} xl={6}>
                <Col>
                    <h6>Add a thread...</h6>
                    <div className="input-group">
                        <Form.Group>
                            <Button variant="secondary" id="uploadButton" type="submit" name="uploadBtn" disabled={this.state.activeState} onClick={this.handleFileUpload}>
                                Upload
                            </Button>
                        </Form.Group>
                        <div className="custom-file">
                            <input
                                type="file"
                                className="custom-file-input"
                                id="inputGroupFile01"
                                aria-describedby="inpStGroupFileAddon01"
                                onChange={this.handleFileBrowse}
                            />
                            <label className="custom-file-label" htmlFor="inputGroupFile01">
                                {this.state.filename}
                            </label>
                        </div>
                    </div>
                </Col>
            </div>
        );
    }

}

export default UploadImage;