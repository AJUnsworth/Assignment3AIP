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
            loading: true
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


    displayOwnPosts = (refresh) => {
        const self = this;
        let skippedPosts;

        if (!refresh) {
            skippedPosts = this.state.posts.length;
        } else {
            skippedPosts = 0;
        }

        fetch(`/post/getOwnPosts?skippedPosts=${skippedPosts}`)
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
                                isShowMoreDisabled: prevState.posts.length + data.results.length === data.metadata[0].totalCount
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
                                            <td><FontAwesomeIcon icon={faUpload} className="iconSpacing text-primary" />Posts</td>
                                            <td><FontAwesomeIcon icon={faHeart} className="iconSpacing rhsIcon text-danger" />Reacts</td>
                                        </tr>

                                    </table>
                                </td>
                            </tr>
                        </table>
                    </div>

                    <div className="myPosts">
                        <h2 className="myPostsText">My Posts</h2>

                    </div>
                </div>
            </div>
        );
    }
}

export default User;