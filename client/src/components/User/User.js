import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faUpload } from "@fortawesome/free-solid-svg-icons";
import { NotificationManager } from "react-notifications";

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
                        <table>
                            <tr>
                                <td className="rightColumn"><h1>{this.state.user.username}</h1>
                                    <table className="rightInfo">
                                        <tr>
                                            <td>
                                                <h2>{this.state.user.postCount}</h2>
                                            </td>
                                            <td>
                                                <h2>{this.state.user.reactionCount}</h2>
                                            </td>
                                        </tr >
                                        <tr>
                                            <td><FontAwesomeIcon icon={faUpload} className="iconSpacing text-primary" />Posts &#38; Replies</td>
                                            <td><FontAwesomeIcon icon={faHeart} className="iconSpacing rhsIcon text-danger" />Reacts</td>
                                        </tr>

                                    </table>
                                </td>
                            </tr>
                        </table>
                    </div>

                    <div className="myPosts">
                        <h2 className="myPostsText">{this.state.user.username}'s Posts</h2>
                        <ImageGrid displayUserPosts={this.displayUserPosts} sortBy='users' {...this.state} {...this.props}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default User;