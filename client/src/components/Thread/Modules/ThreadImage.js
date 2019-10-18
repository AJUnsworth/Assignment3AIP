import React from "react";
import "./ThreadImage.css";
import PlaceholderImage from "../../../images/ImageRemovedPlaceholder.png";
import PropTypes from 'prop-types';

//Displays the actual post as an image
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