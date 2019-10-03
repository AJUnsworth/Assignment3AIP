import React from "react";

import "./LeaderboardMember.css";

class LeaderboardMember extends React.Component {
    render() {
        return (
            <div className="LeaderboardMember">
                <label className="LeaderboardMemberName">{this.props.members.users.username}</label>
                <label className="LeaderboardRank">Reactions: {this.props.members.totalUserReactions}</label>
            </div>
        );
    }
}

export default LeaderboardMember;