import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faHeart, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Badge from "react-bootstrap/Badge";
import { NotificationManager } from "react-notifications";

import "./ReactionCounter.css";


class ReactionCounter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            totalReplies: 0,
            totalReactions: 0,
            loading: true
        }
    }

    componentDidMount() {
        this.loadMetrics();
    }

    loadMetrics() {
        const self = this;
        fetch("/post/metrics?post_id=" + this.props.post._id, {
            method: "GET"
        })
            .then(response => {
                if (response.status === 200) {
                    response.json().then(metrics => {
                        self.setState({
                            totalReactions: metrics.totalReactions,
                            totalReplies: metrics.totalReplies,
                            loading: false
                        });
                    });
                } else {
                    self.setState({ loading: false });
                    NotificationManager.error(
                        "Looks like something went wrong while loading posts, please try refreshing the page",
                        "Error loading posts",
                        5000
                    );
                }
            });
    }

    render() {
        return (
            <Badge pill variant="light">
                <FontAwesomeIcon icon={faComments} className="iconSpacing text-primary" />
                {this.state.loading 
                    ? <FontAwesomeIcon id="loading" className="fa-1x" icon={faSpinner} spin /> 
                    : this.state.totalReplies
                }
                <FontAwesomeIcon icon={faHeart} className="iconSpacing rhsIcon text-danger" />
                {this.state.loading 
                    ? <FontAwesomeIcon id="loading" className="fa-1x" icon={faSpinner} spin /> 
                    : this.state.totalReactions
                }
            </Badge>
        );
    }
}

export default ReactionCounter;