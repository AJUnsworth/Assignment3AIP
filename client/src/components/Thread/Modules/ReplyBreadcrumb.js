import React from "react";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

import { showError } from "../../../errors";
import PlaceholderImage from "../../../images/ImageRemovedPlaceholder.png";
import "./ReplyBreadcrumb.css";

class ReplyBreadcrumb extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            replyParents: [],
            loading: true
        };
    }

    componentDidMount() {
        this.getReplyThread();
    }

    componentDidUpdate(prevProps) {
        //Update breadcrumb when a post has been edited
        if (prevProps.post !== this.props.post) {
            this.getReplyThread();
        }
    }

    //Gets all parents to the current comment when viewing a reply to a post
    //Placeholder images will be rendered for any flagged or deleted posts
    async getReplyThread() {
        if (this.props.post.replyTo) {
            const response = await fetch(`/api/posts/${this.props.post._id}/parents`, {
                method: "GET"
            });

            const data = await response.json();

            if (response.status === 200) {
                this.setState({ replyParents: data });
            } else {
                showError(data.error);
            }

            this.setState({ loading: false });
        }
    }

    renderReplyParents() {
        if (this.state.loading) {
            return <FontAwesomeIcon id="loading" className="fa-5x" icon={faSpinner} spin />;
        } else {
            return (this.state.replyParents.map((post, index) => {
                return (
                    <Breadcrumb.Item key={post._id} href={"/thread/" + post._id}>
                        <img src={(!post.flagged && post.imageUrl) ? post.imageUrl : PlaceholderImage} className="breadcrumbImage" alt={post.user.username + "'s post"} />
                    </Breadcrumb.Item>
                );
            }));
        }
    }

    render() {
        return (
            <div xs={12} sm={12} md={12} lg={12} xl={12}>
                <h6 className="breadcrumbTitle">This image is part of the following thread</h6>
                <Breadcrumb xs={12} sm={12} md={12} lg={12} xl={12}>
                    {this.renderReplyParents()}
                </Breadcrumb>
            </div>
        );
    }
}

ReplyBreadcrumb.propTypes = {
    post: PropTypes.object.isRequired
};

export default ReplyBreadcrumb;