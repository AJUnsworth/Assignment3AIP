import React from "react";
import { Link } from "react-router-dom";

import ReactionCounter from "../Thread/ReactionCounter";
import TestImage from "../../images/TestImage.jfif";
import "./ImageFrame.css";

class ImageFrame extends React.Component {
    render() {
        return (
            <Link to="/thread/">
                <div className="imageFrame">
                    <ReactionCounter />
                    {/* eslint-disable-next-line */}
                    <img src={TestImage} className="image" />
                </div>
            </Link>
        );
    }
}

export default ImageFrame;