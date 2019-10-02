import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faHeart } from "@fortawesome/free-solid-svg-icons";
import Badge from "react-bootstrap/Badge";

import "./ReactionCounter.css";


class ReactionCounter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            repliesCount: 0,
            reactionsCount: 0
        }
    }

    componentDidMount() {
        this.loadRepliesCount();
        this.loadReactionCount();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.postId !== this.props.postId) {
            this.loadRepliesCount();
            this.loadReactionCount();
        }
    }

    loadRepliesCount() {
        const self = this;
        fetch("/post/getRepliesCount?post_id=" + this.props.postId, {
            method: "GET"
        })
            .then(response => {
                response.json().then(data => {
                    self.setState({ repliesCount: data })
                });
            });
    }

    loadReactionCount() {
        const self = this;
        fetch("/post/getReactionCount?post_id=" + this.props.postId, {
            method: "GET"
        })
            .then(response => {
                response.json().then(data => {
                    self.setState({ reactionsCount: data });
                })
            })
    }

    render() {
        return (
            <Badge pill variant="light">
                <FontAwesomeIcon icon={faComments} className="iconSpacing text-primary" />
                {this.state.repliesCount}
                <FontAwesomeIcon icon={faHeart} className="iconSpacing rhsIcon text-danger" />
                {this.state.reactionsCount}
            </Badge>
        );
    }
}

export default ReactionCounter;