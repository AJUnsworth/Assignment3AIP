import React from "react";
import "./ThreadImage.css";

class ThreadImage extends React.Component {
    render() {
        return (
            <div className="threadImageContainer">
                {/* eslint-disable-next-line */}
                <img src={this.props.imageUrl} className="threadImage" />
            </div>

        );
    }
}

export default ThreadImage;