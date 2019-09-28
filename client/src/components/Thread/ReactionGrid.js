import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGrinHearts, faGrinSquint, faSadCry, faSurprise, faAngry, faThumbsUp } from "@fortawesome/free-solid-svg-icons";

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
            activeReaction: ""
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
                    response.json().then(data => {
                        self.setState(data);
                    })
                });
        }
    }

    addReaction = e => {
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

        if (reactionType === originalReactionType) {
            fetch("/post/removeReaction", {
                method: "POST",
                body: requestBody,
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(response => {
                    response.json().then(data => {
                        self.setState({
                            activeReaction: "",
                            [reactionState]: data[reactionType]
                        });
                    });
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
                    response.json().then(data => {
                        if (originalReactionType) {
                            self.setState({
                                activeReaction: reactionType,
                                [reactionState]: data[reactionType],
                                [originalReactionState]: data[originalReactionType]
                            });
                        } else {
                            self.setState({
                                activeReaction: reactionType,
                                [reactionState]: data[reactionType]
                            });
                        }
                    });
                });
        }
    }

    render() {
        return (
            <div className="reactionGrid">
                <table className="reactionTable">
                    <tbody>
                        <tr>
                            <td>
                                <FontAwesomeIcon id="like" icon={faThumbsUp} className={this.state.activeReaction === "like" ? "fa-3x active" : "fa-3x"} onClick={this.addReaction} />
                                <h1 className="reactionCount">{this.state.likeReactions}</h1>
                            </td>
                            <td>
                                <FontAwesomeIcon id="laugh" icon={faGrinSquint} className={this.state.activeReaction === "laugh" ? "fa-3x active" : "fa-3x"} onClick={this.addReaction} />
                                <h1 className="reactionCount">{this.state.laughReactions}</h1>
                            </td>
                            <td>
                                <FontAwesomeIcon id="love" icon={faGrinHearts} className={this.state.activeReaction === "love" ? "fa-3x active" : "fa-3x"} onClick={this.addReaction} />
                                <h1 className="reactionCount">{this.state.loveReactions}</h1>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <FontAwesomeIcon id="wow" icon={faSurprise} className={this.state.activeReaction === "wow" ? "fa-3x active" : "fa-3x"} onClick={this.addReaction} />
                                <h1 className="reactionCount">{this.state.wowReactions}</h1>
                            </td>
                            <td>
                                <FontAwesomeIcon id="tears" icon={faSadCry} className={this.state.activeReaction === "tears" ? "fa-3x active" : "fa-3x"} onClick={this.addReaction} />
                                <h1 className="reactionCount">{this.state.tearsReactions}</h1>
                            </td>
                            <td>
                                <FontAwesomeIcon id="angry" icon={faAngry} className={this.state.activeReaction === "angry" ? "fa-3x active" : "fa-3x"} onClick={this.addReaction} />
                                <h1 className="reactionCount">{this.state.angryReactions}</h1>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ReactionGrid;