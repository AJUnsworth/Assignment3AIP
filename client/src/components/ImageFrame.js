import React from 'react';
import './ImageFrame.css';
import { ReactionCounter } from './ReactionCounter';

export class ImageFrame extends React.Component {
    render () {
        return (
            <div className="imageFrame">
                <ReactionCounter/>
            </div>
        );
    }
}
