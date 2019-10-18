import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faHeart, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Badge from "react-bootstrap/Badge";
import PropTypes from 'prop-types';

import { showError } from "../../../../errors";
import "./MetricCounter.css";


class MetricCounter extends React.Component {
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

    componentDidUpdate(prevProps) {
        if (prevProps.post !== this.props.post) {
            this.loadMetrics();
        }
    }

    async loadMetrics() {
        this.setState({ loading: true });

        const response = await fetch(`/posts/${this.props.post._id}/metrics`, {
            method: "GET"
        });

        const data = await response.json();

        if (response.status === 200) {
            this.setState({
                totalReactions: data.totalReactions,
                totalReplies: data.totalReplies
            });
        } else {
            showError(data.error);
        }

        this.setState({ loading: false });
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

MetricCounter.propTypes = {
    post: PropTypes.object.isRequired
};

export default MetricCounter;