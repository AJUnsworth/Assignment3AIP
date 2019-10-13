import React from "react";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Col from "react-bootstrap/Col";

class SortImageButtons extends React.Component {
    constructor(props) {
        super(props)
        if (!props.sortBy) {
            this.state = {
                sortBy: "latest",
                showResults: true
            }
        } else {
            this.state = {
                sortBy: props.sortBy,
                showResults: true
            }
        }
    };

    handleLatestFilter = () => {
        if (this.state.sortBy === 'popular' || this.state.sortBy === 'latest') {
            this.props.displayPosts(true)
            this.handleSortBy('latest');
        }
        if (this.state.sortBy === 'usersPopular' || this.state.sortBy === 'usersRecent') {
            this.props.displayRecentUserPosts(true)
            this.handleSortBy('usersRecent');
        }
        if (this.state.sortBy === 'repliesRecent' || this.state.sortBy === 'repliesPopular') {
            this.props.displayRecentReplies(true)
            this.handleSortBy('repliesRecent');
        }
    }

    handlePopularFilter = () => {
        if (this.state.sortBy === 'popular' || this.state.sortBy === 'latest') {
            this.props.displayPopular(true)
            this.handleSortBy('popular');
        }
        if (this.state.sortBy === 'usersPopular' || this.state.sortBy === 'usersRecent') {
            this.props.displayPopularUserPosts(true)
            this.handleSortBy('usersPopular');
        }
        if (this.state.sortBy === 'repliesRecent' || this.state.sortBy === 'repliesPopular') {
            this.props.displayPopularReplies(true)
            this.handleSortBy('repliesPopular');
        }
    }
    
    handleSortBy = (value) => {
        this.setState({ sortBy: value })
    }
 
    render() {
        return (
            <Col xs={12} sm={12} md={12} lg={5} xl={5}>
            {this.state.showResults ? <div><h6>Sort by</h6><ToggleButtonGroup type="radio" defaultValue={1} name="sortBy" >
                <ToggleButton variant="secondary" value={1} onClick={this.handleLatestFilter}>Latest</ToggleButton>
                <ToggleButton variant="secondary" value={2} onClick={this.handlePopularFilter}>Most Popular</ToggleButton>
            </ToggleButtonGroup></div> : null}
        </Col>
        );
    }

}

export default SortImageButtons;