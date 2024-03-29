import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Masonry from "react-masonry-css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

import SortImageButtons from "./Functions/SortImageButtons";
import UploadImageForm from "./Functions/UploadImageForm";
import ImageFrame from "./ImageFrame/ImageFrame";
import "./ImageGrid.css";


/** Displays image grid posts in most recent createdAt date order.
 * Handles sort by methods and show more buttons. 
 * Renders upload button if user is logged in.
*/

class ImageGrid extends React.Component {
    constructor(props) {
        super(props)
        let sortBy = props.sortBy ? props.sortBy : "latest";
        this.state = { sortBy: sortBy };
    };

    componentDidMount() {
        //Load first set of posts
        this.handleNewPosts();
    }

    //Clears and refreshes posts on page to match new sorting method
    handleNewPosts = () => {
        this.props.getPosts(true, this.state.sortBy);
    }

    //Retains already displayed posts and adds additional posts onto the imageGrid
    handleShowMore = () => {
        this.props.getPosts(false, this.state.sortBy);
    }

    handleSortBy = (sortingMethod) => {
        this.setState({ sortBy: sortingMethod }, () => this.handleNewPosts());
    }

    renderFileUpload() {
        //Display upload only if a user is logged in, or a component does not permit uploading
        if (this.props.currentUser && this.props.showUpload) {
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
                <div className="showMoreBtnContainer">
                    {this.props.isShowMoreDisabled && <h6 >There are no more posts to display.</h6>}
                    <Button variant="info" disabled={this.props.isShowMoreDisabled} onClick={this.handleShowMore}>Show More</Button>
                </div>
            );
        }
    }

    render() {
        const posts = this.props.posts && this.props.posts.map((post, index) => {
            return <ImageFrame key={post._id} post={post} />
        });

        return (
            <div>
                <div className="imageGrid">
                    <Container className="noPadding">
                        <Row>
                            {this.renderFileUpload()}
                            {/*Only show filters if a component requires them*/}
                            {
                                this.props.showFilters &&
                                <SortImageButtons {...this.state} {...this.props} handleSortBy={this.handleSortBy} />
                            }
                        </Row>
                    </Container>

                    {/*ALL Masonry Component and associated CSS is from: https://github.com/paulcollett/react-masonry-css*/}
                    <Masonry
                        breakpointCols={{
                            default: 3,
                            1100: 2,
                            700: 1
                        }}
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

ImageGrid.defaultProps = {
    showFilters: true,
    showUpload: true
};

ImageGrid.propTypes = {
    getPosts: PropTypes.func.isRequired,
    showFilters: PropTypes.bool,
    showUpload: PropTypes.bool,
    sortBy: PropTypes.string,
    replyTo: PropTypes.object,
    posts: PropTypes.arrayOf(PropTypes.object).isRequired,
    currentUser: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    isShowMoreDisabled: PropTypes.bool                          
}

export default ImageGrid;