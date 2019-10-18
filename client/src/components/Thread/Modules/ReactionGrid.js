import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGrinHearts, faGrinSquint, faSadCry, faSurprise, faAngry, faThumbsUp, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { NotificationManager } from "react-notifications";
import { withRouter } from "react-router-dom";
import PropTypes from 'prop-types';

import ActionModal from "../../ActionModal/ActionModal";
import { showError } from "../../../errors";
import "./ReactionGrid.css";

class ReactionGrid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeReaction: "None selected",
            loading: true,
            showSuggestLogin: false
        };
    }

    componentDidMount() {
        if (this.props.currentUser) {
            this.getUserReaction();
        }

        this.setState({ loading: false });
    }

    //Find user's reaction to post and set it as active if they have previously reacted to the image
    async getUserReaction() {
        const response = await fetch(`/users/${this.props.currentUser.id}/reaction?post_id=${this.props.post._id}`, {
            method: "GET"
        });

        const data = await response.json();

        if (response.status === 200) {
            this.setState({ activeReaction: data });
        } else {
            showError(data.error);
        }
    }

    //Allows logged in users to react to a post
    //Either creates a new reaction, toggles a user's reactionType or removes a reaction 
    react = async e => {
        //User's cannot reply to a placeholder post
        if (!this.props.post.imageUrl) {
            NotificationManager.warning(
                "Since this post is deleted, it can't be reacted to",
                "Cannot react to post",
                5000
            );
        } else if (this.props.currentUser) {
            const reactionType = e.currentTarget.id;

            const requestBody = JSON.stringify({
                reactionType: reactionType
            });

            this.setState({ loading: true });

            const response = await fetch(`/posts/${this.props.post._id}/react`, {
                method: "PUT",
                body: requestBody,
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();

            if (response.status === 200) {
                this.setState({
                    activeReaction: reactionType,
                    loading: false
                });

                //Update reactions in parent component (thread)
                this.props.handleReactionUpdate(data);
            } else {
                this.setState({ loading: false });
                showError(data.error);
            }
        } else {
            //Suggests users login if trying to react without being logged in
            this.handleShowSuggestLogin();
        }
    }

    //Show/close modal suggesting that user should login
    handleCloseSuggestLogin = () => {
        this.setState({ showSuggestLogin: !this.state.showSuggestLogin });
    }

    //Send users to login page if they wish to log into the system
    handleLogin = () => {
        this.props.history.push("/login");
    }

    renderGrid() {
        if (this.state.loading) {
            return <FontAwesomeIcon id="loading" className="fa-5x" icon={faSpinner} spin />;
        }
        else {
            const reactions = this.props.post.reactions;
            return (
                <table className="reactionTable">
                    <tbody>
                        <tr>
                            <td>
                                <FontAwesomeIcon id="like" icon={faThumbsUp} className={this.state.activeReaction === "like" ? "fa-3x reaction active" : "reaction fa-3x"} onClick={this.react} />
                                <h1 className="reactionCount">{reactions.like}</h1>
                            </td>
                            <td>
                                <FontAwesomeIcon id="laugh" icon={faGrinSquint} className={this.state.activeReaction === "laugh" ? "fa-3x reaction active" : "reaction fa-3x"} onClick={this.react} />
                                <h1 className="reactionCount">{reactions.laugh}</h1>
                            </td>
                            <td>
                                <FontAwesomeIcon id="love" icon={faGrinHearts} className={this.state.activeReaction === "love" ? "fa-3x reaction active" : "reaction fa-3x"} onClick={this.react} />
                                <h1 className="reactionCount">{reactions.love}</h1>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <FontAwesomeIcon id="wow" icon={faSurprise} className={this.state.activeReaction === "wow" ? "fa-3x reaction active" : "reaction fa-3x"} onClick={this.react} />
                                <h1 className="reactionCount">{reactions.wow}</h1>
                            </td>
                            <td>
                                <FontAwesomeIcon id="tears" icon={faSadCry} className={this.state.activeReaction === "tears" ? "fa-3x reaction active" : "reaction fa-3x"} onClick={this.react} />
                                <h1 className="reactionCount">{reactions.tears}</h1>
                            </td>
                            <td>
                                <FontAwesomeIcon id="angry" icon={faAngry} className={this.state.activeReaction === "angry" ? "fa-3x reaction active" : "reaction fa-3x"} onClick={this.react} />
                                <h1 className="reactionCount">{reactions.angry}</h1>
                            </td>
                        </tr>
                    </tbody>
                </table>
            );
        }
    }

    render() {
        return (
            <div className="reactionGrid">
                {this.renderGrid()}

                <ActionModal
                    show={this.state.showSuggestLogin}
                    handleShowModal={this.handleShowSuggestLogin}
                    title={"Log in"}
                    handleModalAction={this.handleLogin}
                    modalActionText={"Login"}
                >
                    You must be logged in to react to posts. Would you like to log in?
                </ActionModal>
            </div>
        );
    }
}

ReactionGrid.propTypes = {
    currentUser: PropTypes.object,
    handleReactionUpdate: PropTypes.func,
    post: PropTypes.object.isRequired
};

export default withRouter(ReactionGrid);