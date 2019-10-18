import React from "react";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import "./LeaderboardMember.css";

//Displays each top users username and number of received reactions on the leaderboard
class LeaderboardMember extends React.Component {
    render() {
        return (
            <Row className="LeaderboardMember align-items-center">
                <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                    {this.props.position + 1}
                </Col>
                <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                    <Link to={"/user/" + this.props.member._id} className="LeaderboardMemberName">
                        {this.props.member.username}
                    </Link>
                </Col>
                <Col xs={4} sm={4} md={{ span: 3, offset: 1 }} lg={{ span: 3, offset: 1 }} xl={{ span: 3, offset: 1 }} className="float-right">
                    <Row className="align-self-end align-items-center">
                        <label className="LeaderboardRank">{this.props.member.totalUserReactions}</label>
                        <FontAwesomeIcon icon={faHeart} className="iconSpacing rhsIcon text-danger" />
                    </Row>
                </Col>
            </Row>
        );
    }
}

LeaderboardMember.propTypes = {
    position: PropTypes.number.isRequired, 
    member: PropTypes.object.isRequired
};

export default LeaderboardMember;