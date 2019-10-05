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
            likeReactions: 0,
            laughReactions: 0,
            loveReactions: 0,
            wowReactions: 0,
            tearsReactions: 0,
            angryReactions: 0,
            activeReaction: "None selected",
            loading: true,
            showSuggestLogin: false
        };
    }

    componentWillReceiveProps(nextProps) {
        const reactions = nextProps.post.reactions;
        if (Object.keys(nextProps.post).length !== 0) {
            this.setState({
                likeReactions: reactions.like,
                laughReactions: reactions.laugh,
                loveReactions: reactions.love,
                wowReactions: reactions.wow,
                tearsReactions: reactions.tears,
                angryReactions: reactions.angry
            });
        }

        const self = this;
        if (this.props.currentUser) {
            fetch("/users/getPostReaction?user_id=" + this.props.currentUser.id + "&post_id=" + nextProps.post._id, {
                method: "GET"
            })
                .then(response => {
                    if (response.status === 200) {
                        response.json().then(data => {
                            self.setState({
                                activeReaction: data,
                                loading: false
                            });
                        })
                    } else {
                        self.setState({ loading: false });
                        NotificationManager.error(
                            "Looks like something went wrong while loading the post, please try refreshing the page",
                            "Error loading posts",
                            5000
                        );
                    }
                });
        } else {
            this.setState({ loading: false });
        }
    }

    addReaction = e => {
        if (this.props.currentUser) {
            const self = this;
            const originalReactionType = this.state.activeReaction;
            const originalReactionState = originalReactionType + "Reactions";
            const reactionType = e.currentTarget.id;
            const reactionState = reactionType + "Reactions";

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
                                    [reactionState]: data[reactionType],
                                    loading: false
                                });
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
                                        [reactionState]: data[reactionType],
                                        [originalReactionState]: data[originalReactionType],
                                        loading: false
                                    });
                                } else {
                                    self.setState({
                                        activeReaction: reactionType,
                                        [reactionState]: data[reactionType],
                                        loading: false
                                    });
                                }
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
                <tbody>
                    <tr>
                        <td>
                            <FontAwesomeIcon id="like" icon={faThumbsUp} className={this.state.activeReaction === "like" ? "fa-3x reaction active" : "reaction fa-3x"} onClick={this.addReaction} />
                            <h1 className="reactionCount">{this.state.likeReactions}</h1>
                        </td>
                        <td>
                            <FontAwesomeIcon id="laugh" icon={faGrinSquint} className={this.state.activeReaction === "laugh" ? "fa-3x reaction active" : "reaction fa-3x"} onClick={this.addReaction} />
                            <h1 className="reactionCount">{this.state.laughReactions}</h1>
                        </td>
                        <td>
                            <FontAwesomeIcon id="love" icon={faGrinHearts} className={this.state.activeReaction === "love" ? "fa-3x reaction active" : "reaction fa-3x"} onClick={this.addReaction} />
                            <h1 className="reactionCount">{this.state.loveReactions}</h1>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <FontAwesomeIcon id="wow" icon={faSurprise} className={this.state.activeReaction === "wow" ? "fa-3x reaction active" : "reaction fa-3x"} onClick={this.addReaction} />
                            <h1 className="reactionCount">{this.state.wowReactions}</h1>
                        </td>
                        <td>
                            <FontAwesomeIcon id="tears" icon={faSadCry} className={this.state.activeReaction === "tears" ? "fa-3x reaction active" : "reaction fa-3x"} onClick={this.addReaction} />
                            <h1 className="reactionCount">{this.state.tearsReactions}</h1>
                        </td>
                        <td>
                            <FontAwesomeIcon id="angry" icon={faAngry} className={this.state.activeReaction === "angry" ? "fa-3x reaction active" : "reaction fa-3x"} onClick={this.addReaction} />
                            <h1 className="reactionCount">{this.state.angryReactions}</h1>
                        </td>
                    </tr>
                </tbody>
            );
        }
    }

    render() {
        return (
            <div className="reactionGrid">
                <table className="reactionTable">
                    {this.renderLoading()}
                </table>

                <Modal show={this.state.showSuggestLogin} onHide={this.handleCloseSuggestLogin}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Post</Modal.Title>
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