import React from "react";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Col from "react-bootstrap/Col";

class SortImageButtons extends React.Component {
    handleSortByChange = value => {
        this.props.handleSortBy(value);
    }

    render() {
        return (
            <Col xs={12} sm={12} md={12} lg={5} xl={5}>
                    <div>
                        <h6>Sort by</h6>
                        <ToggleButtonGroup type="radio" defaultValue={this.props.sortBy} onChange={this.handleSortByChange} name="sortBy" >
                            <ToggleButton variant="secondary" value={"latest"} >Latest</ToggleButton>
                            <ToggleButton variant="secondary" value={"popular"} >Most Popular</ToggleButton>
                        </ToggleButtonGroup>
                    </div>
            </Col>
        );
    }

}

export default SortImageButtons;