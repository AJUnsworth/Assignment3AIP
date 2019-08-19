import React from 'react';
import './LeaderboardMember.css';

export class LeaderboardMember extends React.Component {
    render () {
        return (
            <div class='LeaderboardMember'>
                <label class='LeaderboardMemberName'>{this.props.member.name}</label>
                <label class='LeaderboardRank'>{this.props.member.rank}</label>
            </div>
        );
    }
}

export default LeaderboardMember;