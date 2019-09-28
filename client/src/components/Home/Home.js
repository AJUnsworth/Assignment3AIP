import React from "react";
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

    displayPosts = () => {
        const self = this;
        const skippedPosts = this.state.posts.length;
        fetch(`/post/getThumbnails?skippedPosts=${skippedPosts}`)
            .then(function (response) {
                if (response.status === 404) {
                    response.json().then(function (data) {
                        //self.setState({ errors: data });
                    });
                }
                else if (response.status === 200) {
                    response.json().then(function (data) {
                        self.setState(prevState => ({
                            posts: [...prevState.posts, ...data.results],
                            isShowMoreDisabled: prevState.posts.length + data.results.length === data.metadata[0].totalCount
                        }))
                    });
                }
            })
    }

    render() {
        return (
            <div>
                <Navbar {...this.props}/>
                <ContentFrame displayPosts={this.displayPosts} {...this.state} {...this.props} />
            </div>
        );
    }
}

export default Home;