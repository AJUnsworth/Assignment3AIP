import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import PropTypes from 'prop-types';

const ActionModal = props => {
    return (
        <Modal show={props.show} onHide={props.handleShowModal}>
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.children}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleShowModal}>
                    Cancel
                </Button>
                {props.handleModalAction &&
                    <Button variant="danger" onClick={props.handleModalAction}>
                        {props.modalActionText}
                    </Button>
                }
            </Modal.Footer>
        </Modal>
    );
}

ActionModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleShowModal: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    handleModalAction: PropTypes.func,
    modalActionText: PropTypes.string
};


export default ActionModal;