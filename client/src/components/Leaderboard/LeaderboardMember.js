import React from 'react';
import './LeaderboardMember.css';

class LeaderboardMember extends React.Component {
    render () {
        return (
            <div className='LeaderboardMember'>
                <label className='LeaderboardMemberName'>{this.props.member.name}</label>
                <label className='LeaderboardRank'>{this.props.member.rank}</label>
            </div>
        );
    }
}

export default LeaderboardMember;