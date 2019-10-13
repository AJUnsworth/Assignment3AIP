import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGrinHearts, faGrinSquint, faSadCry, faSurprise, faAngry, faThumbsUp, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { NotificationManager } from "react-notifications";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { withRouter } from "react-router-dom";

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

    async getUserReaction() {
        const response = await fetch("/users/reaction?post_id=" + this.props.post._id, {
            method: "GET"
        });

        if (response.status === 200) {
            const activeReaction = await response.json();
            this.setState({ activeReaction: activeReaction });
        } else {
            NotificationManager.error(
                "Looks like something went wrong while loading the post, please try refreshing the page",
                "Error loading posts",
                5000
            );
        }
    }

    react = e => {
        if (!this.props.post.imageUrl) {
            NotificationManager.warning(
                "Since this post is deleted, it can't be reacted to",
                "Cannot react to post",
                5000
            );
        } else if (this.props.currentUser) {
            const self = this;
            const originalReactionType = this.state.activeReaction;
            const reactionType = e.currentTarget.id;

            const requestBody = JSON.stringify({
                postId: this.props.post._id,
                reactionType: reactionType
            });

            this.setState({ loading: true });

            fetch("/post/react", {
                method: "POST",
                body: requestBody,
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(response => {
                    if (response.status === 200) {
                        response.json().then(data => {
                            if (originalReactionType !== reactionType) {
                                self.setState({
                                    activeReaction: reactionType,
                                    loading: false
                                });
                            } else {
                                self.setState({
                                    activeReaction: null,
                                    loading: false
                                });
                            }
                            self.props.handleReactionUpdate(data);
                        });
                    } else {
                        self.setState({ loading: false });
                        NotificationManager.error(
                            "Looks like something went wrong while reacting to the post, please try refreshing the page",
                            "Error reacting to post",
                            5000
                        );
                    }
                });
        } else {
            this.setState({ showSuggestLogin: true });
        }
    }

    handleCloseSuggestLogin = () => {
        this.setState({ showSuggestLogin: false });
    }

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

                <Modal show={this.state.showSuggestLogin} onHide={this.handleCloseSuggestLogin}>
                    <Modal.Header closeButton>
                        <Modal.Title>Log in</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>You must be logged in to react to posts. Would you like to log in?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleCloseSuggestLogin}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.handleLogin}>
                            Login
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default withRouter(ReactionGrid);