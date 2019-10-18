import React from "react";
import PropTypes from "prop-types";

import PlaceholderImage from "../../../images/ImageRemovedPlaceholder.png";
import MetricCounter from "./Functions/MetricCounter";
import "./ImageFrame.css";

//Displays a single image thumbnail
//If there is not imageUrl (e.g. post with replies has been deleted), a placeholder image is shown instead
function ImageFrame(props) {
    return (
        //Using 'a' instead of 'Link' so page refreshes when visiting replies from a parent thread
        //Otherwise, the page does not reload the component
        <a href={`/thread/${props.post._id}`}>
            <div className="imageFrame">
                <MetricCounter post={props.post} />
                {/* eslint-disable-next-line */}
                <img src={props.post.imageUrl ? props.post.imageUrl : PlaceholderImage} className="image" />
            </div>
        </a>
    );
}

ImageFrame.propTypes = {
    post: PropTypes.object.isRequired
};

export default ImageFrame;