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

    displayPosts = async (refresh, method) => {
        let skippedPosts;
        this.setState({ loading: true });

        if (!refresh) {
            skippedPosts = this.state.posts.length;
        } else {
            skippedPosts = 0;
        }

        const response = await fetch(`/post/${method}?skippedPosts=${skippedPosts}`);
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
            showError(data.error);
            this.setState({ loading: false });
        }
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