import React from "react";
import Button from "react-bootstrap/Button";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import ImageFrame from "./ImageFrame";
import "./ImageGrid.css";

class ImageGrid extends React.Component {
    render() {
        return (
            <div>
                <div className="imageGrid">
                    <Container>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={6} xl={6}>
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
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                                <h6>Sort by</h6>
                                <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
                                    <ToggleButton value={1} variant="secondary">Latest</ToggleButton>
                                    <ToggleButton value={2} variant="secondary">Most Popular</ToggleButton>
                                    <ToggleButton value={3} variant="secondary">Trending</ToggleButton>
                                </ToggleButtonGroup>
                            </Col>
                        </Row>
                    </Container>

                    <div className="justify-content-between width">
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
                    <div className="showMoreBtnContainer">
                        <Button variant="info">Show More</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ImageGrid;