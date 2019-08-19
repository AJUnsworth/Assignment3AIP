import React from 'react';
import './ImageGrid.css';
import ImageFrame from './ImageFrame';

// Image Grid Logic using StackOverFlow logic
// https://stackoverflow.com/questions/48418116/how-to-dynamically-populate-bootstrap-grids-using-reactjs

export class ImageGrid extends React.Component {
    render() {
        return (
            <div class="imageGrid">
                <ImageFrame/>
                <ImageFrame/>
                <ImageFrame/>
                <ImageFrame/>
                <ImageFrame/>
                <ImageFrame/>
                <ImageFrame/>
                <ImageFrame/>
                <ImageFrame/>
                <ImageFrame/>
                <ImageFrame/>
            </div>
        );
    }
}

export default ImageGrid;