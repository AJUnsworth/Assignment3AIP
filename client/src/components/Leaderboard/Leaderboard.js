import React from "react";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

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
            .then(
                //Below is handling error
                function (response) {
                    if (response.status !== 200) {
                        console.log("Looks like there was a problem. Status Code: " +
                            response.status);
                        return;
                    }

                    // Below converts the response to json and set members to the data
                    response.json().then(function (data) {
                        self.setState({ members: data });
                    });
                }
            )
            .catch(function (err) {
                console.log("Fetch Error :-S", err);
            });

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
                {this.state.members.map((members) => {
                    return <LeaderboardMember members={members} />
                })}
            </div>
        );
    }
}

export default Leaderboard;