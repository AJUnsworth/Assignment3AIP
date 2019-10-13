import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Masonry from 'react-masonry-css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import SortImageButtons from "./Functions/SortImage";
import UploadImageForm from "./Functions/UploadImageForm";
import ImageFrame from "./ImageFrame";
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
    };

    componentDidMount() {
        this.handleNewPosts();
    }

    handleNewPosts = () => {
        if (this.state.sortBy === 'latest') {
            this.props.displayPosts(true);
        } else if (this.state.sortBy === 'popular') {
            this.props.displayPopular(true);
        }
        else if (this.state.sortBy === 'usersRecent') {
            this.props.displayRecentUserPosts(true);
        }
        else if (this.state.sortBy === 'usersPopular') {
            this.props.displayPopularUserPosts(true);
        }
        else if (this.state.sortBy === 'repliesRecent') {
            this.props.displayRecentReplies(true);
        }
        else if (this.state.sortBy === 'repliesPopular') {
            this.props.displayPopularReplies(true);
        }
    }

    handleShowMore = () => {
        if (this.state.sortBy === 'latest') {
            this.props.displayPosts(false);
        } else if (this.state.sortBy === 'popular') {
            this.props.displayPopular(false);
        }
        else if (this.state.sortBy === 'usersRecent') {
            this.props.displayRecentUserPosts(false);
        }
        else if (this.state.sortBy === 'usersPopular') {
            this.props.displayPopularUserPosts(false);
        }
        else if (this.state.sortBy === 'repliesRecent') {
            this.props.displayRecentReplies(false);
        }
        else if (this.state.sortBy === 'repliesPopular') {
            this.props.displayPopularReplies(false);
        }
    }

    renderFileUpload() {
        if (!this.props.currentUser || (this.props.post && !this.props.post.imageUrl) || this.props.user) {
            return null;
        } else {
            return (
                <UploadImageForm {...this.props} handleNewPosts={this.handleNewPosts} />
            );
        }
    }

    renderShowMoreButton() {
        if (this.props.loading) {
            return <FontAwesomeIcon id="loading" className="fa-5x loadingPostIcon" icon={faSpinner} spin />;
        } else {
            return (
                <>
                    <div className="showMoreBtnContainer">
                        {this.props.isShowMoreDisabled && <h6 >There are no more posts to display.</h6>}
                        <Button variant="info" disabled={this.props.isShowMoreDisabled} onClick={this.handleShowMore}>Show More</Button>
                    </div>
                </>
            );
        }
    }

    render() {
        const posts = this.props.posts && this.props.posts.map((post, index) => {
            return <ImageFrame key={index} post={post} />
        });

        return (
            <div>
                <div className="imageGrid">
                    <Container className="noPadding">
                        <Row>
                            {/*Render upload button only if there is a current user set*/}
                            {this.renderFileUpload()}
                            <SortImageButtons {...this.props}/>
                        </Row>
                    </Container>

                    {/*ALL Masonry Component and associated CSS is from: https://github.com/paulcollett/react-masonry-css*/}
                    <Masonry
                        breakpointCols={{
                            default: 3,
                            1100: 2,
                            700: 1}}
                        className="my-masonry-grid"
                        columnClassName="my-masonry-grid_column"
                    >
                        {posts}
                    </Masonry>

                    {this.renderShowMoreButton()}
                </div>
            </div>
        );
    }
}

export default ImageGrid;