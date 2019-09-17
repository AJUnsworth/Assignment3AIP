import React from "react";
import Button from "react-bootstrap/Button";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { NotificationManager } from "react-notifications";
import Form from "react-bootstrap/Form";

import ImageFrame from "./ImageFrame";
import "./ImageGrid.css";

class ImageGrid extends React.Component {
    constructor() {
        super()
        this.initialState = { imgFile: null, filename: "Choose file" }
        this.handleFileBrowse = this.handleFileBrowse.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.state = this.initialState;
    }

    handleFileBrowse(e) {
        e.preventDefault();
        // eslint-disable-next-line
        this.setState({ imgFile: e.target.files[0], filename: e.target.value.replace(/^.*[\\\/]/, '') })
    }

    handleFileUpload() {
        const self = this;
        const userId = JSON.parse(localStorage.getItem("User")).id;
        var formData = new FormData();
        formData.append('image', this.state.imgFile);
        formData.append('userId', userId);

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
    }


render() {
    return (
        <div>
            <div className="imageGrid">
                <Container>
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                            <h6>Add a thread...</h6>
                            {/*upload button function taken from the following website:*/}
                            {/*https://mdbootstrap.com/docs/react/forms/file-input/*/}
                            <div className="input-group">
                            <Form.Group>
                                <Button variant="primary" type="submit" name="uploadBtn" onClick={this.handleFileUpload}>
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
                        <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                            <h6>Sort by</h6>
                            <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
                                <ToggleButton value={1} variant="secondary">Latest</ToggleButton>
                                <ToggleButton value={2} variant="secondary">Most Popular</ToggleButton>
                                <ToggleButton value={3} variant="secondary">Trending</ToggleButton>
                            </ToggleButtonGroup>
                        </Col>
                    </Row>
                </Container>

                <div className="justify-content-between width">
                    <ImageFrame />
                    <ImageFrame />
                    <ImageFrame />
                    <ImageFrame />
                    <ImageFrame />
                    <ImageFrame />
                    <ImageFrame />
                    <ImageFrame />
                    <ImageFrame />
                    <ImageFrame />
                </div>
                <div className="showMoreBtnContainer">
                    <Button variant="info">Show More</Button>
                </div>
            </div>
        </div>
    );

}
}

export default ImageGrid;