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
            isActive: false,
        };
    }

    addLikeReaction = () => {
        this.setState({ isActive: !this.state.isActive, likeReactions: this.state.likeReactions + 1 });
    }

    addLaughReaction = () => {
        this.setState({ laughReactions: this.state.laughReactions + 1 });
    }

    addLoveReaction = () => {
        this.setState({ loveReactions: this.state.loveReactions + 1 });
    }

    addWowReaction = () => {
        this.setState({ wowReactions: this.state.wowReactions + 1 });
    }

    addTearsReaction = () => {
        this.setState({ tearsReactions: this.state.tearsReactions + 1 });
    }

    addAngryReaction = () => {
        this.setState({ angryReactions: this.state.angryReactions + 1 });
    }

    render() {
        return (
            <div className="reactionGrid">
                <table className="reactionTable">
                    <tr>
                        <td><FontAwesomeIcon icon={faThumbsUp} className={this.state.isActive ? "fa-3x active" : "fa-3x"} onClick={this.addLikeReaction} /><h1 class="reactionCount">{this.state.likeReactions}</h1></td>
                        <td><FontAwesomeIcon icon={faGrinSquint} className="fa-3x" onClick={this.addLaughReaction} /><h1 class="reactionCount">{this.state.laughReactions}</h1></td>
                        <td><FontAwesomeIcon icon={faGrinHearts} className="fa-3x" onClick={this.addLoveReaction} /><h1 class="reactionCount">{this.state.loveReactions}</h1></td>
                    </tr>
                    <tr>
                        <td><FontAwesomeIcon icon={faSurprise} className="fa-3x" onClick={this.addWowReaction} /><h1 class="reactionCount">{this.state.wowReactions}</h1></td>
                        <td><FontAwesomeIcon icon={faSadCry} className="fa-3x" onClick={this.addTearsReaction} /><h1 class="reactionCount">{this.state.tearsReactions}</h1></td>
                        <td><FontAwesomeIcon icon={faAngry} className="fa-3x" onClick={this.addAngryReaction} /><h1 class="reactionCount">{this.state.angryReactions}</h1></td>
                    </tr>
                </table>
            </div>
        );
    }
}

export default ReactionGrid;