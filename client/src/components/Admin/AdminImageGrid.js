import React from "react";
import Button from "react-bootstrap/Button";
import Masonry from 'react-masonry-css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import ImageFrame from "../Image/ImageFrame";
import "./AdminImageGrid.css";

class AdminImageGrid extends React.Component {
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

    renderPosts() {
        
        if (this.props.loading) {
            return <FontAwesomeIcon id="loading" className="fa-5x loadingPostIcon" icon={faSpinner} spin />;
        } else {
            /*ALL Masonry Component and associated CSS is from: https://github.com/paulcollett/react-masonry-css*/
            const posts = this.props.posts && this.props.posts.map((post, index) => {
                return <ImageFrame key={index} post={post} />
            });

            return (
                <>
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
                    <div className="showMoreBtnContainer">
                        {this.props.isShowMoreDisabled && <h6 >There are no more posts to display.</h6>}
                        <Button variant="info" disabled={this.props.isShowMoreDisabled} onClick={this.handleShowMore}>Show More</Button>
                    </div>
                </>
            );
        }
    }

    render() {
        return (
            <div>
                <div className="adminImageGrid">
                    {this.renderPosts()}
                </div>
            </div>
        );

    }
}

export default AdminImageGrid;