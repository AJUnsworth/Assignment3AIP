import React from "react";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { NotificationManager } from "react-notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import PlaceholderImage from "../../images/imageremovedplaceholder.png";
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
        this.setState({ replyParents: [this.props.post] }, () => {
            this.getReplyThread();
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.post !== this.props.post) {
            this.setState({ replyParents: [this.props.post] }, () => {
                this.getReplyThread();
            });
        }
    }

    async getReplyThread() {
        if (this.props.post.replyTo) {
            for (let depth = 0; depth < this.props.post.depth; depth++) {
                //Always check replyParents on first member of the array as they are appended to the beggining
                const response = await fetch("/post/" + this.state.replyParents[0].replyTo, {
                    method: "GET"
                });

                if (response.status === 200) {
                    const data = await response.json();
                    this.setState(prevState => ({
                        replyParents: [data, ...prevState.replyParents]
                    }));
                } else {
                    NotificationManager.error(
                        "Looks like something went wrong while loading the post, please try refreshing the page",
                        "Error loading post",
                        5000
                    );
                }
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
                    <Breadcrumb.Item key={index} href={"/thread/" + post._id}>
                        <img src={(!post.flagged && post.imageUrl) ? post.imageUrl : PlaceholderImage} className="breadcrumbImage" alt={post.userId.username + "'s post"} />
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

export default ReplyBreadcrumb;