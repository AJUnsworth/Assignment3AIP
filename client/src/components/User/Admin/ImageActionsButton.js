import React from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Modal from "react-bootstrap/Modal";

class ImageActionsButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
        }
    }

    handleShowModal = () => {
        this.setState({ showModal: true });
    }

    handleCloseModal = () => {
        this.setState({ showModal: false });
    }

    handleApprove = () => {
        //Remove image flag
        //Return to admin dashboard
    }

    handleDelete = () => {
        //Delete image as admin
    }

    render() {
        return (
            <div className="imageActionsButton">
                <ButtonGroup>
                    <Button variant="secondary" size="sm" onClick={this.handleApprove}>Approve</Button>
                    <Button variant="danger" size="sm" onClick={this.handleShowModal}>Remove</Button>
                </ButtonGroup>

                <Modal show={this.state.showModal} onHide={this.handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm deletion</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to proceed?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleCloseModal}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={this.handleDelete}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );

    };
}

export default ImageActionsButton;