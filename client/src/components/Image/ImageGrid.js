import React from "react";
import Button from "react-bootstrap/Button";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Masonry from 'react-masonry-css';

import ImageFrame from "./ImageFrame";
import UploadImage from "./UploadImage";
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

    renderFileUpload() {
        if (this.props.currentUser) {
            console.log(this.props.currentUser);
            return (
                <UploadImage/>
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
                            <Col xs={12} sm={12} md={12} lg={5} xl={5}>
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