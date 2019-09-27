import React from "react";
import "./ThreadImage.css";
import ProfilePhoto from "../../images/profilepic.jpg";

class ThreadImage extends React.Component {
    render() {
        return (
            <div className="threadImageContainer">
                {/* eslint-disable-next-line */}
                <img src={this.props.imageUrl ? this.props.imageUrl : ProfilePhoto} className="threadImage" />
            </div>

        );
    }
}

export default ThreadImage;