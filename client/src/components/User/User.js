import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComments, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { showError } from "../../errors";
import Navbar from "../Navbar/Navbar";
import ImageGrid from "../ImageGrid/ImageGrid";
import "./User.css";

class User extends React.Component {
    constructor() {
        super();
        this.state = {
            user: {},
            posts: [],
            loadingContent: true,
            loading: true,
            isShowMoreDisabled: false
        }
    }

    async componentDidMount() {
        const { userId } = this.props.match.params;

        const response = await fetch(`/users/${userId}`, {
            method: "GET"
        });

        const data = await response.json();

        if (response.status === 200) {
            this.setState({ user: data, loadingContent: false })
        } else if (response.status === 404) {
            this.props.history.push("/");
        } else {
            this.setState({ loadingContent: false });
            showError(data.error);
        }
    }

    displayRecentUserPosts = async refresh => {
        let skippedPosts;
        const { userId } = this.props.match.params;
        this.setState({ loading: true });

        if (!refresh) {
            skippedPosts = this.state.posts.length;
        } else {
            skippedPosts = 0;
        }
        
        const response = await fetch(`/users/${userId}/latest?skippedPosts=${skippedPosts}`);

        const data = await response.json();

        if (response.status === 200) {
            if (!refresh) {
                this.setState(prevState => ({
                    posts: [...prevState.posts, ...data.results],
                    isShowMoreDisabled: prevState.posts.length + data.results.length === data.metadata[0].totalCount,
                    loading: false
                }));
            } else {
                this.setState({
                    posts: data.results,
                    isShowMoreDisabled: data.results.length < 10,
                    loading: false
                });
            }
        } else {
            this.setState({ loading: false });
            showError(data.error);
        }
    }

    displayPopularUserPosts = async refresh => {
        let skippedPosts;
        const { userId } = this.props.match.params;
        this.setState({ loading: true });

        if (!refresh) {
            skippedPosts = this.state.posts.length;
        } else {
            skippedPosts = 0;
        }

        const response = await fetch(`/users/${userId}/popular?skippedPosts=${skippedPosts}`);

        const data = await response.json();

        if (response.status === 200) {
            if (!refresh) {
                this.setState(prevState => ({
                    posts: [...prevState.posts, ...data.results],
                    isShowMoreDisabled: prevState.posts.length + data.results.length === data.metadata[0].totalCount,
                    loading: false
                }));
            } else {
                this.setState({
                    posts: data.results,
                    isShowMoreDisabled: data.results.length < 10,
                    loading: false
                });
            }
        } else {
            this.setState({ loading: false });
            showError(data.error);
        }
    }

    renderUserContent() {
        if (this.state.loadingContent) {
            return <FontAwesomeIcon id="loading" className="fa-10x loadingIcon loadIconColor" icon={faSpinner} spin />;
        } else {
            return (
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
                                xs={{ span: 11, offset: 1 }}
                                sm={{ span: 11, offset: 1 }}
                                md={{ span: 4, offset: 2 }}
                                lg={{ span: 5, offset: 3 }}
                                xl={{ span: 4, offset: 4 }}>
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
                        <ImageGrid
                            displayLatest={this.displayRecentUserPosts}
                            displayPopular={this.displayPopularUserPosts}
                            sortBy='latest'
                            {...this.state}
                            {...this.props}
                        />
                    </div>
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                <Navbar {...this.props} />
                {this.renderUserContent()}
            </div>
        );
    }
}

export default User;