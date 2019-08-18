import React from 'react';
import './LeaderboardMember.css';

export class LeaderboardMember extends React.Component {
    render () {
        return (
            <div class='LeaderboardMember'>
                <div>
                <label class='LeaderboardMemberName'>John Smith</label>
                <label class='LeaderboardRank'>#1</label>
                </div>
                <label class='LeaderboardMetric'>Test</label>
            </div>
        );
    }
} 