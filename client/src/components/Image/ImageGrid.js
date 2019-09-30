import React from "react";
import Button from "react-bootstrap/Button";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { NotificationManager } from "react-notifications";
import Form from "react-bootstrap/Form";
import Masonry from 'react-masonry-css';

import ImageFrame from "./ImageFrame";
import "./ImageGrid.css";

class ImageGrid extends React.Component {
    constructor() {
        super()
        this.initialState = {
            imgFile: null,
            filename: "Choose file",
            activeState: true
        };
        this.state = this.initialState;
    }

    componentDidMount() {
        this.props.displayPosts(0);
    }

    handleFileBrowse = e => {
        e.preventDefault();
        // eslint-disable-next-line
        this.setState({ imgFile: e.target.files[0], filename: e.target.value.replace(/^.*[\\\/]/, '') });
        this.setState({activeState: false});
    }

    handleFileUpload = () => {
        const self = this;
        const userId = this.props.currentUser.id;
        var formData = new FormData();
        formData.append("image", this.state.imgFile);
        formData.append("userId", userId);
        this.setState({activeState: true});

        if (this.props.replyTo) {
            formData.append("replyTo", this.props.replyTo._id);

            //Check the depth of the parent, if it doesn't have a depth assigned then it is the first reply
            if(this.props.replyTo.depth !== null) {
                formData.append("depth", this.props.replyTo.depth + 1);
            } else {
                formData.append("depth", 1);
            }
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
    }

    renderFileUpload() {
        if (this.props.currentUser) {
            return (
                <Col xs={12} sm={12} md={12} lg={6} xl={6}>
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
            );
        }
    }


    render() {
        //Display thumbnails for each post
        const posts = this.props.posts.map((post, index) => {
            return <ImageFrame key={index} post={post} />
        });

        return (
            <div>
                <div className="imageGrid">
                    <Container>
                        <Row>
                            {/*Render upload button only if there is a current user set*/}
                            {this.renderFileUpload()}
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


                    {/*ALL Masonry Component and associated CSS is from: https://github.com/paulcollett/react-masonry-css*/}
                    <Masonry
                        breakpointCols={3}
                        className="my-masonry-grid"
                        columnClassName="my-masonry-grid_column"
                    >
                        {posts}
                    </Masonry>
                    <div className="showMoreBtnContainer">
                        <Button variant="info" disabled={this.props.isShowMoreDisabled} onClick={this.props.displayPosts}>Show More</Button>
                    </div>
                </div>
            </div>
        );

    }
}

export default ImageGrid;