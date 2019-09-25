import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faHeart } from "@fortawesome/free-solid-svg-icons";
import Badge from "react-bootstrap/Badge";

import "./ReactionCounter.css";


class ReactionCounter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reactions: 0
        }
    }

    componentDidMount() {
        const self = this;
        fetch("/post/getReactionCount?post_id=" + this.props.postId, {
            method: "GET"
        })
            .then(response => {
                response.json().then(data => {
                    self.setState({ reactions: data });
                })
            })
    }

    render() {
        return (
            <Badge pill variant="light">
                <FontAwesomeIcon icon={faComments} className="iconSpacing text-primary" />
                8
                <FontAwesomeIcon icon={faHeart} className="iconSpacing rhsIcon text-danger" />
                {this.state.reactions}
            </Badge>
        );
    }
}

export default ReactionCounter;