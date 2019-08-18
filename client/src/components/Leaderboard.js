import React from 'react';
import { LeaderboardMember } from '../components/LeaderboardMember';
import './Leaderboard.css';

export class Leaderboard extends React.Component {
    render () {
        return (
            <div class='Leaderboard'>
                <h1>Leaderboard</h1>
                <LeaderboardMember/>
                <LeaderboardMember/>
                <LeaderboardMember/>
                <LeaderboardMember/>
            </div>
        );
    }
} 