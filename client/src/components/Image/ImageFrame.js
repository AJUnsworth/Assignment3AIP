import React from "react";

import PlaceholderImage from "../../images/imageremovedplaceholder.png";
import ReactionCounter from "../Thread/ReactionCounter";
import "./ImageFrame.css";

class ImageFrame extends React.Component {
    render() {
        return (
            //Using 'a' instead of 'Link' so page refreshes when visiting replies from a parent thread
            //Otherwise, the page does not reload the component
            <a href={"/thread/" + this.props.post._id}>
                <div className="imageFrame">
                    <ReactionCounter postId={this.props.post._id} />
                    {/* eslint-disable-next-line */}
                    <img src={this.props.post.imageUrl ? this.props.post.imageUrl : PlaceholderImage} className="image" />
                </div>
            </a>
        );
    }
}

export default ImageFrame;