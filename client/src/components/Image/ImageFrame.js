import React from "react";
import { Link } from "react-router-dom";

import ReactionCounter from "../Thread/ReactionCounter";
import "./ImageFrame.css";

class ImageFrame extends React.Component {
    render() {
        return (
            <Link to={"/thread/" + this.props.post._id}>
                <div className="imageFrame">
                    <ReactionCounter postId={this.props.post._id} />
                    {/* eslint-disable-next-line */}
                    <img src={this.props.post.imageUrl} className="image" />
                </div>
            </Link>
        );
    }
}

export default ImageFrame;