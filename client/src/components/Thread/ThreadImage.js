import React from 'react';
import TestImage from '../../images/TestImage.jfif'
import './ThreadImage.css';
import ReactionCounter from './ReactionCounter';

class ThreadImage extends React.Component {
    render () {
        return (
            <div class="threadImageContainer">
                <ReactionCounter/>
                {/* eslint-disable-next-line */}
                <img src={TestImage} className="threadImage"/>
            </div>
            
        );
    }
}

export default ThreadImage;