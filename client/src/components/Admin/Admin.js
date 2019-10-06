import React from "react";
import { NotificationManager } from "react-notifications";
import authenticate from "../Authentication/Authenticate";

import Navbar from "../Navbar/Navbar";
import ContentFrame from "../Image/ContentFrame";

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            isShowMoreDisabled: false,
            loading: true
        }
    }

    displayPosts = () => {
        const self = this;
        const skippedPosts = this.state.posts.length;
        this.setState({ loading: true });

        fetch(`/post/flagged?skippedPosts=${skippedPosts}`)
            .then(function (response) {
                if (response.status === 200) {
                    response.json().then(function (data) {
                        self.setState(prevState => ({
                            posts: [...prevState.posts, ...data.posts],
                            isShowMoreDisabled: prevState.posts.length + data.posts.length === data.postCount,
                            loading: false
                        }));
                    });
                } else {
                    self.setState({ loading: false });
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
                <ContentFrame isAdminPage={true} displayPosts={this.displayPosts} {...this.state} {...this.props} />
            </div>
        );
    }
}

export default authenticate(Admin);