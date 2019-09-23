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
        const post = nextProps.post;
        this.setState({
            likeReactions: post.likeReactions,
            laughReactions: post.laughReactions,
            loveReactions: post.loveReactions,
            wowReactions: post.wowReactions,
            tearsReactions: post.tearsReactions,
            angryReactions: post.angryReactions
        });

        const self = this;
        const userId = JSON.parse(localStorage.getItem("User")).id;
        fetch("/users/getPostReaction?user_id=" + userId + "&post_id=" + post._id, {
            method: "GET"
        })
            .then(response => {
                response.json().then(data => {
                    self.setState(data);
                })
            });
    }

    addReaction = e => {
        const self = this;
        const originalReactionType = this.state.activeReaction;
        const originalReactionState = originalReactionType + "Reactions";
        const reactionType = e.currentTarget.id;
        const reactionState = reactionType + "Reactions";

        const requestBody = JSON.stringify({
            userId: JSON.parse(localStorage.getItem("User")).id,
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
                            [reactionState]: data[reactionState]
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
                                    [reactionState]: data[reactionState],
                                    [originalReactionState]: data[originalReactionState]
                                });
                            } else {
                                self.setState({
                                    activeReaction: reactionType, 
                                    [reactionState]: data[reactionState]
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
                </table>
            </div>
        );
    }
}

export default ReactionGrid;