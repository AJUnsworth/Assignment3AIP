import React from "react";

import ReactionCounter from "./ReactionCounter";
import TestImage from "../../images/TestImage.jfif";
import "./ThreadImage.css";

class ThreadImage extends React.Component {
    render() {
        return (
            <div class="threadImageContainer">
                <ReactionCounter />
                {/* eslint-disable-next-line */}
                <img src={TestImage} className="threadImage" />
            </div>

        );
    }
}

export default ThreadImage;