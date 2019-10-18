import React from "react";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import { showError } from "../../errors";
import LeaderboardMember from "./Members/LeaderboardMember";
import "./Leaderboard.css";

//Fetches top users based on reaction counts for the leaderboard
//Able to change how many top users are shown with 'limit'
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
        this.displayLeaderboard();
    }

    displayLeaderboard = async limit => {
        this.setState({ loading: true });

        const response = await fetch(`/users/leaderboard?limit=${limit}`);

        const data = await response.json();

        if (response.status === 200) {
            this.setState({ members: data });
        } else {
            showError(data.error);
        }

        this.setState({ loading: false });
    }

    renderLeaderboardButtons() {
        return (
            <>
                <h1>Leaderboard</h1>
                <h6>Total number of reactions across all posts</h6>
                <ToggleButtonGroup type="radio" name="options" defaultValue={5} onChange={this.displayLeaderboard} className="shift">
                    <ToggleButton value={5} variant="secondary"> Top 5 </ToggleButton>
                    <ToggleButton value={10} variant="secondary"> Top 10 </ToggleButton>
                    <ToggleButton value={20} variant="secondary"> Top 20 </ToggleButton>
                </ToggleButtonGroup>
            </>
        );
    }

    renderLeaderboard() {
        if (this.state.loading) {
            return <FontAwesomeIcon id="loading" className="fa-3x loadIconColor" icon={faSpinner} spin />;
        } else {
            return (this.state.members.map((member, index) => {
                return <LeaderboardMember {...this.props} key={member._id} position={index} member={member} />
            }));
        }
    }

    render() {
        return (
            <div className="Leaderboard">
                {this.renderLeaderboardButtons()}
                {this.renderLeaderboard()}
            </div>
        );
    }
}

export default Leaderboard;