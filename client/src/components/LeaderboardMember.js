import React from 'react';
import './LeaderboardMember.css';

export class LeaderboardMember extends React.Component {
    render () {
        return (
            <div class='LeaderboardMember'>
                <label class='LeaderboardMemberName'>John Smith</label>
                <label class='LeaderboardRank'>Rank #1</label>
            </div>
        );
    }
} 