import React from "react";
import Breadcrumb from 'react-bootstrap/Breadcrumb';

import "./ReplyBreadcrumb.css";

class ReplyBreadcrumb extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            replyParents: []
        };
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

                const data = await response.json();

                this.setState(prevState => ({
                    replyParents: [data, ...prevState.replyParents]
                }));
            }
        }
    }

    render() {
        const replyParents = this.state.replyParents.map((post, index) => {
            return (
                <Breadcrumb.Item key={index} href={"/thread/" + post._id}>
                    <img src={post.imageUrl} className="breadcrumbImage" alt={post.userId.username + "'s post"} />
                </Breadcrumb.Item>
            );
        });

        return (
            <div>
                <h6 className="breadcrumbTitle">This image is part of the following thread</h6>
                <Breadcrumb>
                    {replyParents}
                </Breadcrumb>
            </div>
        );


    }
}

export default ReplyBreadcrumb;