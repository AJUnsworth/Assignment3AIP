import React from 'react';
import LeaderboardMember from './LeaderboardMember';
import './Leaderboard.css';

class Leaderboard extends React.Component {
    render () {
        return (
            <div class='Leaderboard'>
                <h1>Leaderboard</h1>
                {this.props.members.map((member, index) => {
                    return <LeaderboardMember key={index} member={member}/>
                })}
            </div>
        );
    }
}

export default Leaderboard;