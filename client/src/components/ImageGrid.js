import React from 'react';
import './ImageGrid.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ImageFrame } from './ImageFrame';

// Image Grid Logic using StackOverFlow logic
// https://stackoverflow.com/questions/48418116/how-to-dynamically-populate-bootstrap-grids-using-reactjs

export class ImageGrid extends React.Component {
    render() {
        return (
            <Container className="imageGrid">
                <Row>
                    <Col sm><ImageFrame/></Col>
                    <Col sm><ImageFrame/></Col>
                    <Col sm><ImageFrame/></Col>
                </Row>
            </Container>
        );
    }
}
