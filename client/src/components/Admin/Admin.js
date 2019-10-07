import React from "react";
import { NotificationManager } from "react-notifications";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import authenticate from "../Authentication/Authenticate";
import AdminImageGrid from "../Admin/AdminImageGrid";
import Navbar from "../Navbar/Navbar";

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
                <Container className="contentFrame">
                    <Row className="rowPadding">
                        <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                            <h1 className="welcomeMessage">
                                Welcome&nbsp;
                                <Link to={this.props.currentUser ? "/user/" + this.props.currentUser.id : "/login"}>
                                    {this.props.currentUser ? this.props.currentUser.username : ""}
                                </Link>
                            </h1>
                            <h4>All flagged posts can be seen below</h4>
                            {/*<ImageActionsButton/>*/}
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={8} xl={12} className="contentFrameGrid">
                            <AdminImageGrid {...this.props} displayPosts={this.displayPosts} {...this.state} />
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default authenticate(Admin);