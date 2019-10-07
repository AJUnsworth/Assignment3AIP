import React from "react";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import { NotificationManager } from "react-notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import LeaderboardMember from "./LeaderboardMember";
import "./Leaderboard.css";

class Leaderboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            members: [],
            loading: true,
            isShowMoreDisabled: false
        };
    }

    componentDidMount() {
        if (this.props.isAdminPage) {
            this.displayFlaggedUsers();
        } else {
            this.displayLeaderboard();
        }
    }

    displayLeaderboard(limit) {
        const self = this;
        this.setState({ loading: true });

        fetch(`/leaderboard?limit=${limit}`) //Using fetch from https://developers.google.com/web/updates/2015/03/introduction-to-fetch
            .then(response => {
                if (response.status === 200) {
                    response.json().then(function (data) {
                        self.setState({
                            members: data,
                            loading: false
                        });
                    });
                } else {
                    self.setState({ loading: false });
                    NotificationManager.error(
                        "Looks like something went wrong while trying to load the leaderboard, please try refreshing the page",
                        "Error loading leaderboard",
                        5000
                    );
                }
            });
    }

    renderLeaderboardButtons() {
        return (
            <>
                <h1>Leaderboard</h1>
                <h6>Total number of reactions across all posts</h6>
                <ToggleButtonGroup type="radio" name="options" defaultValue={1} className="shift">
                    <ToggleButton value={1} variant="secondary" onClick={() => { this.displayLeaderboard(5) }}>Top 5</ToggleButton>
                    <ToggleButton value={2} variant="secondary" onClick={() => { this.displayLeaderboard(10) }}>Top 10</ToggleButton>
                    <ToggleButton value={3} variant="secondary" onClick={() => { this.displayLeaderboard(20) }}>Top 20</ToggleButton>
                </ToggleButtonGroup>
            </>
        );
    }

    renderLeaderboard() {
        if (this.state.loading) {
            return <FontAwesomeIcon id="loading" className="fa-3x" icon={faSpinner} spin />;
        } else {
            return (this.state.members.map((member, index) => {
                return <LeaderboardMember {...this.props} key={index} position={index} member={member} />
            }));
        }
    }

    render() {
        return (
            <div className="Leaderboard">
                {this.renderLeaderboardButtons()}
                {this.renderLeaderboard()}
            </div >
        );
    }
}

export default Leaderboard;