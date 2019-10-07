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
            reactions: {},
            activeReaction: "None selected",
            loading: true,
            showSuggestLogin: false
        };
    }

    async componentDidMount() {
        const post = this.props.post;
        if (this.props.currentUser) {
            await this.getUserReaction();
        }

        this.setState({
            reactions: post.reactions,
            loading: false
        });
    }

    async getUserReaction() {
        const response = await fetch("/users/getPostReaction?user_id=" + this.props.currentUser.id + "&post_id=" + this.props.post._id, {
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

    addReaction = e => {
        if (this.props.currentUser) {
            const self = this;
            const originalReactionType = this.state.activeReaction;
            const reactionType = e.currentTarget.id;

            const requestBody = JSON.stringify({
                userId: this.props.currentUser.id,
                postId: this.props.post._id,
                reactionType: reactionType
            });

            this.setState({ loading: true });

            if (reactionType === originalReactionType) {
                fetch("/post/removeReaction", {
                    method: "POST",
                    body: requestBody,
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                    .then(response => {
                        if (response.status === 200) {
                            response.json().then(data => {
                                self.setState({
                                    activeReaction: "None selected",
                                    reactions: data,
                                    loading: false
                                });
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
                fetch("/post/addReaction", {
                    method: "POST",
                    body: requestBody,
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                    .then(response => {
                        if (response.status === 200) {
                            response.json().then(data => {
                                if (originalReactionType) {
                                    self.setState({
                                        activeReaction: reactionType,
                                        reactions: data,
                                        loading: false
                                    });
                                } else {
                                    self.setState({
                                        activeReaction: reactionType,
                                        reactions: data,
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
            }
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

    renderLoading() {
        if (this.state.loading) {
            return <FontAwesomeIcon id="loading" className="fa-5x" icon={faSpinner} spin />;
        }
        else {
            return (
                <table className="reactionTable">
                    <tbody>
                        <tr>
                            <td>
                                <FontAwesomeIcon id="like" icon={faThumbsUp} className={this.state.activeReaction === "like" ? "fa-3x reaction active" : "reaction fa-3x"} onClick={this.addReaction} />
                                <h1 className="reactionCount">{this.state.reactions.like}</h1>
                            </td>
                            <td>
                                <FontAwesomeIcon id="laugh" icon={faGrinSquint} className={this.state.activeReaction === "laugh" ? "fa-3x reaction active" : "reaction fa-3x"} onClick={this.addReaction} />
                                <h1 className="reactionCount">{this.state.reactions.laugh}</h1>
                            </td>
                            <td>
                                <FontAwesomeIcon id="love" icon={faGrinHearts} className={this.state.activeReaction === "love" ? "fa-3x reaction active" : "reaction fa-3x"} onClick={this.addReaction} />
                                <h1 className="reactionCount">{this.state.reactions.love}</h1>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <FontAwesomeIcon id="wow" icon={faSurprise} className={this.state.activeReaction === "wow" ? "fa-3x reaction active" : "reaction fa-3x"} onClick={this.addReaction} />
                                <h1 className="reactionCount">{this.state.reactions.wow}</h1>
                            </td>
                            <td>
                                <FontAwesomeIcon id="tears" icon={faSadCry} className={this.state.activeReaction === "tears" ? "fa-3x reaction active" : "reaction fa-3x"} onClick={this.addReaction} />
                                <h1 className="reactionCount">{this.state.reactions.tears}</h1>
                            </td>
                            <td>
                                <FontAwesomeIcon id="angry" icon={faAngry} className={this.state.activeReaction === "angry" ? "fa-3x reaction active" : "reaction fa-3x"} onClick={this.addReaction} />
                                <h1 className="reactionCount">{this.state.reactions.angry}</h1>
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
                {this.renderLoading()}

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