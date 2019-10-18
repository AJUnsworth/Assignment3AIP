import React from "react";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Col from "react-bootstrap/Col";
import PropTypes from 'prop-types';

//Renders toggleable buttons between latest and popular sorting methods
function SortImageButtons(props) {
        return (
            <Col xs={12} sm={12} md={12} lg={5} xl={5}>
                    <div>
                        <h6>Sort by</h6>
                        <ToggleButtonGroup type="radio" defaultValue={props.sortBy} onChange={props.handleSortBy} name="sortBy" >
                            <ToggleButton variant="secondary" value={"latest"} >Latest</ToggleButton>
                            <ToggleButton variant="secondary" value={"popular"} >Most Popular</ToggleButton>
                        </ToggleButtonGroup>
                    </div>
            </Col>
        );
}

SortImageButtons.propTypes = {
    sortBy: PropTypes.string,
    handleSortBy: PropTypes.func               
}

export default SortImageButtons;