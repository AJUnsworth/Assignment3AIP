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
        this.props.displayLatest(true)
        this.props.handleSortBy('latest');
    }

    handlePopularFilter = () => {
        this.props.displayPopular(true)
        this.props.handleSortBy('popular');
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