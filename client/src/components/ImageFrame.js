import React from 'react';
import { Link } from 'react-router-dom';
import './ImageFrame.css';
import { ReactionCounter } from './ReactionCounter';
import TestImage from '../images/TestImage.jfif'

export class ImageFrame extends React.Component {
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
