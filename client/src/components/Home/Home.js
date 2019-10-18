import React from "react";

import { showError } from "../../errors";
import Navbar from "../Navbar/Navbar";
import HomeContent from "./Content/HomeContent";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            isShowMoreDisabled: false,
            loading: true
        }
    }

    // Displays set amount of posts (limit) that are not flagged or replies
    // 'Method' determines whether posts are sorted by latest or popular
    getPosts = async (refresh, method) => {
        let skippedPosts;
        const limit = 10;
        this.setState({ loading: true });

        if (!refresh) {
            skippedPosts = this.state.posts.length;
        } else {
            skippedPosts = 0;
        }

        const response = await fetch(`/api/posts/${method}?skippedPosts=${skippedPosts}&limit=${limit}`);
        const data = await response.json();

        if (response.status === 200) {
            if (!refresh) {
                this.setState(prevState => ({
                    posts: [...prevState.posts, ...data.results],
                    isShowMoreDisabled: prevState.posts.length + data.results.length === data.metadata[0].totalCount
                }));
            } else {
                //Resets array of posts for when swapping sorting methods when refresh is true
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

    render() {
        return (
            <div>
                <Navbar {...this.props} />
                <HomeContent getPosts={this.getPosts} {...this.state} {...this.props} />
            </div>
        );
    }
}

export default Home;