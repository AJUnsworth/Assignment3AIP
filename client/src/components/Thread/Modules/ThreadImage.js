import React from "react";
import "./ThreadImage.css";
import PlaceholderImage from "../../../images/ImageRemovedPlaceholder.png";
import PropTypes from "prop-types";

//Displays image on a post, or a placeholder if the image has been deleted
function ThreadImage(props) {
        return (
            <div className="threadImageContainer">
                {/* eslint-disable-next-line */}
                <img src={props.imageUrl ? props.imageUrl : PlaceholderImage} className="threadImage" />
            </div>

        );
}

ThreadImage.propTypes = {
    imageUrl: PropTypes.string
};

export default ThreadImage;