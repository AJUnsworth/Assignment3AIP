import React from "react";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import { NotificationManager } from "react-notifications";

import LeaderboardMember from "./LeaderboardMember";
import "./Leaderboard.css";

class Leaderboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            members: [],
        };
    }

    componentDidMount() {
        this.displayLeaderboard();
    }

    displayLeaderboard(limit) {
        const self = this;
        fetch(`/leaderboard?limit=${limit}`) //Using fetch from https://developers.google.com/web/updates/2015/03/introduction-to-fetch
            .then(response => {
                if (response.status === 200) {
                    response.json().then(function (data) {
                        self.setState({ members: data });
                    });
                } else {
                    NotificationManager.error(
                        "Looks like something went wrong while trying to load the leaderboard, please try refreshing the page",
                        "Error loading leaderboard",
                        5000
                    );
                }
            }
            );

    }
    render() {
        return (
            <div className="Leaderboard">
                <h1>Leaderboard</h1>
                <div>
                    <ButtonToolbar>
                        <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
                            <ToggleButton value={1} variant="secondary" onClick={() => { this.displayLeaderboard(5) }}>Top 5</ToggleButton>
                            <ToggleButton value={2} variant="secondary" onClick={() => { this.displayLeaderboard(10) }}>Top 10</ToggleButton>
                            <ToggleButton value={3} variant="secondary" onClick={() => { this.displayLeaderboard(20) }}>Top 20</ToggleButton>
                        </ToggleButtonGroup>
                    </ButtonToolbar>
                </div>
                {this.state.members.map((members, index) => {
                    return <LeaderboardMember key={index} members={members} />
                })}
            </div>
        );
    }
}

export default Leaderboard;