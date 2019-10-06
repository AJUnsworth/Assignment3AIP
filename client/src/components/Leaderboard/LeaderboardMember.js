import React from "react";

import "./LeaderboardMember.css";

class LeaderboardMember extends React.Component {
    render() {
        return (
            <div className="LeaderboardMember">
                <label className="LeaderboardMemberName">{this.props.member.username}</label>
                {this.props.member.totalUserReactions &&
                    <label className="LeaderboardRank">Reactions: {this.props.member.totalUserReactions}</label>
                }
            </div>
        );
    }
}

export default LeaderboardMember;