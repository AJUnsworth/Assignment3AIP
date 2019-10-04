import React from "react";
import { NotificationManager } from "react-notifications";

import Navbar from "../Navbar/Navbar";
import ContentFrame from "../Image/ContentFrame";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            isShowMoreDisabled: false
        }
    }

    displayPosts = (refresh) => {
        const self = this;
        let skippedPosts;

        if (!refresh) {
            skippedPosts = this.state.posts.length;
        } else {
            skippedPosts = 0;
        }

        fetch(`/post/getThumbnails?skippedPosts=${skippedPosts}`)
            .then(function (response) {
                if (response.status === 200) {
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
                } else {
                    NotificationManager.error(
                        "Looks like something went wrong while loading posts, please try refreshing the page",
                        "Error loading posts",
                        5000
                    );
                }
            })
    }

    displayPopular = (refresh) => {
        const self = this;
        let skippedPosts;

        if (!refresh) {
            skippedPosts = this.state.posts.length;
        } else {
            skippedPosts = 0;
        }
        fetch(`/post/getPopular?skippedPosts=${skippedPosts}`)
            .then(function (response) {
                if (response.status === 200) {
                    response.json().then(function (data) {
                        if (!refresh) {
                            self.setState(prevState => ({
                                posts: [...prevState.posts, ...data.results],
                                isShowMoreDisabled: prevState.posts.length + data.results.length === data.metadata[0].totalCount
                            }))
                        } else {
                            self.setState({ posts: data.results, isShowMoreDisabled: false });
                        }
                    });
                } else {
                    NotificationManager.error(
                        "Looks like something went wrong while loading posts, please try refreshing the page",
                        "Error loading posts",
                        5000
                    );
                }
            })
    }

    render() {
        return (
            <div>
                <Navbar {...this.props} />
                <ContentFrame displayPosts={this.displayPosts} displayPopular={this.displayPopular} {...this.state} {...this.props} />
            </div>
        );
    }
}

export default Home;