import React from "react";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";

import ImageFrame from "./ImageFrame";
import "./ImageGrid.css";

class ImageGrid extends React.Component {
    render() {
        return (
            <div>
                <div className="imageGrid">
                    <ButtonToolbar className="justify-content-between imageGridToolbar">
                        <div>
                            <h6>Add a thread...</h6>
                            {/*upload button function taken from the following website:*/}
                            {/*https://mdbootstrap.com/docs/react/forms/file-input/*/}
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroupFileAddon01">
                                        Upload
                                        </span>
                                </div>
                                <div className="custom-file">
                                    <input
                                        type="file"
                                        className="custom-file-input"
                                        id="inputGroupFile01"
                                        aria-describedby="inputGroupFileAddon01"
                                    />
                                    <label className="custom-file-label" htmlFor="inputGroupFile01">
                                        Choose file
                                        </label>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h6>Sort by</h6>
                            <ButtonGroup>
                                <Button variant="info">Latest</Button>
                                <Button variant="secondary">Most Popular</Button>
                                <Button variant="secondary">Trending</Button>
                            </ButtonGroup>
                        </div>
                    </ButtonToolbar>
                    <div className="justify-content-between">
                        <ImageFrame />
                        <ImageFrame />
                        <ImageFrame />
                        <ImageFrame />
                        <ImageFrame />
                        <ImageFrame />
                        <ImageFrame />
                        <ImageFrame />
                        <ImageFrame />
                        <ImageFrame />
                        <ImageFrame />
                    </div>
                </div>
                <div className="showMoreBtnContainer">
                    <Button variant="info">Show More</Button>
                </div>
            </div>
        );
    }
}

export default ImageGrid;