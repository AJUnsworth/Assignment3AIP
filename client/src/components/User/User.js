import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComments, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PropTypes from 'prop-types';

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

    //Loads user's details
    //If user is not found, redirects back to home page
    async componentDidMount() {
        const { userId } = this.props.match.params;

        const response = await fetch(`/users/${userId}`, {
            method: "GET"
        });

        const data = await response.json();

        if (response.status === 200) {
            this.setState({ user: data });
        } else if (response.status === 404) {
            this.props.history.push("/");
        } else {
            showError(data.error);
        }

        this.setState({ loadingContent: false });
    }

    //Displays a specified (limit) amount of requested users posts by latest or popular (method)
    //Includes replies, but does not include flagged posts
    displayPosts = async (refresh, method) => {
        let skippedPosts;
        const limit = 10;
        const { userId } = this.props.match.params;
        this.setState({ loading: true });

        //Resets array of posts for when swapping methods
        if (!refresh) {
            skippedPosts = this.state.posts.length;
        } else {
            skippedPosts = 0;
        }
        
        const response = await fetch(`/users/${userId}/posts/${method}?skippedPosts=${skippedPosts}&limit=${limit}`);

        const data = await response.json();

        if (response.status === 200) {
            if (!refresh) {
                this.setState(prevState => ({
                    posts: [...prevState.posts, ...data.results],
                    isShowMoreDisabled: prevState.posts.length + data.results.length === data.metadata[0].totalCount
                }));
            } else {
                this.setState({
                    posts: data.results,
                    isShowMoreDisabled: data.results.length < limit
                });
            }
        } else {
            showError(data.error);
        }

        this.setState({ loading: false });
    }

    renderUserContent() {
        //Allows only current user to post from their user page
        const showUpload = this.props.currentUser && this.props.currentUser.id === this.state.user._id ? true : false;

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
                            displayPosts={this.displayPosts}
                            sortBy='latest'
                            showUpload={showUpload}
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

User.propTypes = {
    currentUser: PropTypes.object
};


export default User;