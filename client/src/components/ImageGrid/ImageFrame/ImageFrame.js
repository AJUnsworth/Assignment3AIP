import React from "react";

import PlaceholderImage from "../../../images/ImageRemovedPlaceholder.png";
import MetricCounter from "./Functions/MetricCounter";
import "./ImageFrame.css";

//Displays each image in ImageFrame.
//If there is not imageUrl (e.g. post with replies has been deleted), a placeholder image is shown instead
class ImageFrame extends React.Component {
    render() {
        return (
            //Using 'a' instead of 'Link' so page refreshes when visiting replies from a parent thread
            //Otherwise, the page does not reload the component
            <a href={"/thread/" + this.props.post._id}>
                <div className="imageFrame">
                    <MetricCounter post={this.props.post} />
                    {/* eslint-disable-next-line */}
                    <img src={this.props.post.imageUrl ? this.props.post.imageUrl : PlaceholderImage} className="image" />
                </div>
            </a>
        );
    }
}

export default ImageFrame;