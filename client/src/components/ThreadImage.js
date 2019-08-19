import React from 'react';
import TestImage from '../images/TestImage.jfif'
import './ThreadImage.css';
import { ReactionCounter } from './ReactionCounter';

export class ThreadImage extends React.Component {
    render () {
        return (
            <img src={TestImage} className="threadImage"/>
        );
    }
}