import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComments } from "@fortawesome/free-solid-svg-icons";
import { NotificationManager } from "react-notifications";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Navbar from "../Navbar/Navbar";
import ImageGrid from "../Image/ImageGrid";
import "./User.css";

class User extends React.Component {

    constructor() {
        super();
        this.state = {
            user: {},
            posts: [],
            loading: true,
            isShowMoreDisabled: false
        }
    }

    componentDidMount() {
        const self = this;
        const { userId } = this.props.match.params;
        fetch("/users/" + userId, {
            method: "GET"
        })
            .then(function (response) {
                if (response.status === 200) {
                    response.json().then(function (data) {
                        self.setState({ user: data, loading: false });
                    });
                } else {
                    NotificationManager.error(
                        "Looks like something went wrong while loading the user page, please try refreshing the page",
                        "Error loading user page",
                        5000
                    );
                }
            })
    }


    displayUserPosts = (refresh) => {
        const self = this;
        let skippedPosts;
        const { userId } = this.props.match.params;

        if (!refresh) {
            skippedPosts = this.state.posts.length;
        } else {
            skippedPosts = 0;
        }

        fetch(`/post/getUserPosts/?userId=${userId}&skippedPosts=${skippedPosts}`)
            .then(function (response) {
                if (response.status === 404) {
                    response.json().then(function (data) {
                        //self.setState({ errors: data });
                    });
                }
                else if (response.status === 200) {
                    response.json().then(function (data) {
                        if (!refresh) {
                            self.setState(prevState => ({
                                posts: [...prevState.posts, ...data.results],
                                isShowMoreDisabled: prevState.posts.length + data.results.length === data.metadata[0].totalCount,
                                loading: false
                            }))
                        } else {
                            self.setState({ posts: data.results, isShowMoreDisabled: false })
                        }
                    });
                }
            })
    }


    render() {
        return (
            <div>
                <Navbar {...this.props} />
                <div className="content">
                    <div className="UserContainer">
                        <Row className="align-items-center">
                            <Col
                                xs={12}
                                sm={12}
                                md={6}
                                lg={4}
                                xl={4}
                                className="verticalColPadding">
                                <h1 className="userTitle">
                                    {this.state.user.username}
                                </h1>
                            </Col>
                            <Col
                                xs={{ span:11, offset:1}}
                                sm={{ span:11, offset:1}}
                                md={{ span:4, offset:2}}
                                lg={{ span:5, offset:3}}
                                xl={{ span:4, offset:4}}>
                                <Row>
                                    <Col className="verticalColPadding textCentred">
                                        <h2>
                                            {this.state.user.postCount}
                                            <FontAwesomeIcon icon={faComments} className="iconSpacing rhsIcon text-primary" />
                                        </h2>
                                        <h5>Posts &#38; Replies</h5>
                                    </Col>
                                    <Col className="verticalColPadding textCentred">
                                        <h2>
                                            {this.state.user.reactionCount}
                                            <FontAwesomeIcon icon={faHeart} className="iconSpacing rhsIcon text-danger" />
                                        </h2>
                                        <h5>Reactions</h5>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>

                    <div className="myPosts">
                        <h2 className="myPostsText">{this.state.user.username}'s Posts</h2>
                        <ImageGrid displayUserPosts={this.displayUserPosts} sortBy='users' {...this.state} {...this.props} />
                    </div>
                </div>
            </div>
        );
    }
}

export default User;