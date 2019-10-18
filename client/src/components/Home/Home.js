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

    /* Displays set amount of posts (limit) depending on refresh and sort by method.
     * 'Refresh' is used to determine if there are more posts to display, and if not the 'Show More' button will disable.
     * 'Method' is used to determine if posts are sorted by createdAt date or by number of reactions  
     */
    displayPosts = async (refresh, method) => {
        let skippedPosts;
        const limit = 10;
        this.setState({ loading: true });

        if (!refresh) {
            skippedPosts = this.state.posts.length;
        } else {
            skippedPosts = 0;
        }

        const response = await fetch(`/posts/${method}?skippedPosts=${skippedPosts}&limit=${limit}`);
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

    render() {
        return (
            <div>
                <Navbar {...this.props} />
                <HomeContent displayPosts={this.displayPosts} {...this.state} {...this.props} />
            </div>
        );
    }
}

export default Home;