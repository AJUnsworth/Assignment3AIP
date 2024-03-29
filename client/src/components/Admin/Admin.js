import React from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PropTypes from "prop-types";

import { showError } from "../../errors";
import ImageGrid from "../ImageGrid/ImageGrid";
import Navbar from "../Navbar/Navbar";
import withAdmin from "../Wrappers/withAdmin";

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            isShowMoreDisabled: false,
            loading: true
        }
    }

    //Gets only flagged posts on admin page
    getPosts = async () => {
        const skippedPosts = this.state.posts.length;
        const limit = 10;
        this.setState({ loading: true });

        const response = await fetch(`/api/posts/flagged?skippedPosts=${skippedPosts}&limit=${limit}`);
        const data = await response.json();

        if (response.status === 200) {
            this.setState(prevState => ({
                posts: [...prevState.posts, ...data.posts],
                isShowMoreDisabled: prevState.posts.length + data.posts.length === data.postCount
            }));
        } else {
            showError(data.error);
        }
        
        this.setState({ loading: false });
    }

    render() {
        return (
            <div>
                <Navbar {...this.props} />
                <Container className="homeContent">
                    <Row className="rowPadding">
                        <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                            <h1 className="welcomeMessage">
                                Welcome&nbsp;
                                <Link to={this.props.currentUser ? "/user/" + this.props.currentUser.id : "/login"}>
                                    {this.props.currentUser ? this.props.currentUser.username : ""}
                                </Link>
                            </h1>
                            <h4>All flagged posts can be seen below</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={8} xl={12} className="homeContentGrid">
                            <ImageGrid
                                {...this.props}
                                {...this.state}
                                getPosts={this.getPosts}
                                showFilters={false}
                                showUpload={false}
                            />
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

Admin.propTypes = {
    currentUser: PropTypes.object
};

export default withAdmin(Admin);