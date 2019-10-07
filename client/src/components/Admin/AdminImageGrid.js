import React from "react";
import Button from "react-bootstrap/Button";
import Masonry from 'react-masonry-css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import ImageFrame from "../Image/ImageFrame";
import "./AdminImageGrid.css";

class AdminImageGrid extends React.Component {
    componentDidMount() {
        this.props.displayPosts();
    }

    handleShowMore = () => {
        this.props.displayPosts();
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
            return <ImageFrame key={index} post={post} />
        });

        return (
            <div>
                <div className="adminImageGrid">
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

export default AdminImageGrid;