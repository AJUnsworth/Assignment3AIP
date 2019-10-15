import React from "react";
import "./ThreadImage.css";
import PlaceholderImage from "../../../images/imageremovedplaceholder.png";

class ThreadImage extends React.Component {
    render() {
        return (
            <div className="threadImageContainer">
                {/* eslint-disable-next-line */}
                <img src={this.props.imageUrl ? this.props.imageUrl : PlaceholderImage} className="threadImage" />
            </div>

        );
    }
}

export default ThreadImage;