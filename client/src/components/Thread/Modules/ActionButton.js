import React from "react";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";

import ActionModal from "../../ActionModal/ActionModal";

//General template for action buttons, includes a modal
class ActionButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
        }
    }

    //Display/close modal
    handleShowModal = () => {
        this.setState({ showModal: !this.state.showModal });
    }

    //Removes flagged status and clears reports on a post, making them visible to any user
    handleModalAction = () => {
        this.props.handleButtonAction();
        this.setState({ showModal: false });
    }

    render() {
        return (
            <>
                <Button variant={this.props.variant} onClick={this.handleShowModal}>{this.props.title}</Button>

                <ActionModal
                    show={this.state.showModal}
                    handleShowModal={this.handleShowModal}
                    title={this.props.title}
                    handleModalAction={this.handleModalAction}
                    modalActionText={this.props.title}
                >
                    {this.props.children}
                </ActionModal>
            </>
        );

    };
}

ActionButton.propTypes = {
    title: PropTypes.string.isRequired,
    variant: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    handleButtonAction: PropTypes.func
};

export default ActionButton;