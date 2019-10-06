import React from "react";
import Button from "react-bootstrap/Button";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Masonry from 'react-masonry-css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import ImageFrame from "./ImageFrame";
import UploadImage from "./UploadImage";
import "./ImageGrid.css";

class ImageGrid extends React.Component {
    constructor(props) {
        super(props)
        if (!props.sortBy) {
            this.state = {
                sortBy: "latest",
                showResults: true
            }
        } else {
            this.state = {
                sortBy: props.sortBy,
                showResults: true
            }
        }
        this.handleHiddenFilters = this.handleHiddenFilters.bind(this)
    };


    componentDidMount() {
        this.handleNewPosts();
        this.handleHiddenFilters();
    }

    handleNewPosts = () => {
        if (this.state.sortBy === 'latest') {
            this.props.displayPosts(true);
        } else if (this.state.sortBy === 'popular') {
            this.props.displayPopular(true);
        }
        else if (this.state.sortBy === 'users') {
            this.props.displayUserPosts(true);
        }
        else if (this.state.sortBy === 'repliesRecent') {
            this.props.displayRecentReplies(true);
        }
    }

    handleHiddenFilters() {
        if (this.state.sortBy === 'users') {
            this.setState(prevState => ({
                showResults: false
            }));
        }
    }

    handleSortBy = (value) => {
        this.setState({ sortBy: value })
    }

    handleShowMore = () => {
        if (this.state.sortBy === 'latest') {
            this.props.displayPosts(false);
        } else if (this.state.sortBy === 'popular') {
            this.props.displayPopular(false);
        }
        else if (this.state.sortBy === 'users') {
            this.props.displayUserPosts(false);
        }
        else if (this.state.sortBy === 'repliesRecent') {
            this.props.displayRecentReplies(false);
        }
    }

    renderFileUpload() {
        if (this.props.currentUser) {
            return (
                <UploadImage {...this.props} handleNewPosts={this.handleNewPosts} />
            );
        }
    }

    renderPosts() {
        console.log(this.props);
        if (this.props.loading) {
            return <FontAwesomeIcon id="loading" className="fa-5x" icon={faSpinner} spin />;
        } else {
            /*ALL Masonry Component and associated CSS is from: https://github.com/paulcollett/react-masonry-css*/
            const posts = this.props.posts && this.props.posts.map((post, index) => {
                return <ImageFrame key={index} post={post} />
            });
            return (
                <Masonry
                    breakpointCols={{ default: 3 }}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                >
                    {posts}
                </Masonry>
            );
        }
    }

    render() {
        return (
            <div>
                <div className="imageGrid">
                    <Container>
                        <Row>
                            {/*Render upload button only if there is a current user set*/}
                            {this.renderFileUpload()}
                            <Col xs={12} sm={12} md={12} lg={5} xl={5}>
                                {this.state.showResults ? <div><h6>Sort by</h6><ToggleButtonGroup type="radio" name="sortBy" value={this.state.sortBy} onChange={this.handleSortBy}>
                                    <ToggleButton value="latest" variant="secondary" onClick={() => this.props.displayPosts(true)}>Latest</ToggleButton>
                                    <ToggleButton value="popular" variant="secondary" onClick={() => this.props.displayPopular(true)}>Most Popular</ToggleButton>
                                </ToggleButtonGroup></div> : null}

                            </Col>
                        </Row>
                    </Container>

                    {this.renderPosts()}

                    <div className="showMoreBtnContainer">
                        <Button variant="info" disabled={this.props.isShowMoreDisabled} onClick={this.handleShowMore}>Show More</Button>
                    </div>
                </div>
            </div>
        );

    }
}

export default ImageGrid;