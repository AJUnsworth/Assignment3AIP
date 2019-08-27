import React from 'react';

import './Leaderboard.css';

import LeaderboardMember from './LeaderboardMember';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import ToggleButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/Button';

class Leaderboard extends React.Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            members: [],
            active: {1: true, 2: false, 3: false},
        };
    }

    
    handleChange(selectedOption) {
        
        // Refactored

        // var i;
        // var h;

        // for (i=0; i <= Object.keys(this.state.active).length; i++) {
        //     if (i === selectedOption) {
        //         console.log(i + " is selected");

        //         for (h=1; h <= Object.keys(this.state.active).length; h++) {
        //             if (h === selectedOption) {
        //                 console.log(h + " active is true");

        //                 // This setState function does not work
        //                 this.setState({active: {h: true}});

        //                 console.log("Should be true -- " + this.state.active[h]);

        //             } else {
        //                 console.log(h + " active is false");

        //                 //This setState function does not work
        //                 this.setState({active: {h: false}});
        //                 console.log("Should be false -- " + this.state.active[h]);
        //             }
        //         }
        //         break;
        //     };
        // }

        // Hard coded activeState Switch

        switch (selectedOption) { 
            
            case 1:
                this.setState({
                    active: {
                        1: true,
                        2: false,
                        3: false,
                    } 
                });
            break;
                
            case 2: 
                this.setState({
                    active: {
                        1: false,
                        2: true,
                        3: false,
                    } 
                });
            break;

            case 3: 
                this.setState({
                    active: {
                        1: false,
                        2: false,
                        3: true,
                    } 
                });
            break;

            default:
                this.setState({
                    active: {
                        1: true,
                        2: false,
                        3: false,
                    } 
                });
            break;
        }
    }

    componentDidMount() {
        this.displayLeaderboard(0, 5);
    }

    displayLeaderboard(start, limit) {
        const self = this;
        console.log("this is working")
        fetch(`http://localhost:4000/leaderboard?start=${start}&limit=${limit}`) //https://developers.google.com/web/updates/2015/03/introduction-to-fetch
            .then(
                //handling error
                function (response) {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                        return;
                    }

                    // Converts the response to json and set members to the data
                    response.json().then(function (data) {
                        self.setState({ members: data });
                    });
                }
            )
            .catch(function (err) {
                console.log('Fetch Error :-S', err);
            });

    }
    render() {
        return (
            <div className='Leaderboard'>
                <h1>Leaderboard</h1>
                <div>
                    <ButtonToolbar>
                        <ToggleButtonGroup type="radio" name="options">
                            <ToggleButton value={1} variant="secondary" active={this.state.active[1]} onClick={()=> {this.displayLeaderboard(0, 5); this.handleChange(1)}}>Top 5</ToggleButton>
                            <ToggleButton value={2} variant="secondary" active={this.state.active[2]} onClick={()=> {this.displayLeaderboard(0, 10); this.handleChange(2)}}>Top 10</ToggleButton>
                            <ToggleButton value={3} variant="secondary" active={this.state.active[3]} onClick={()=> {this.displayLeaderboard(0, 20); this.handleChange(3)}}>Top 20</ToggleButton>
                        </ToggleButtonGroup>
                    </ButtonToolbar>
                </div>
                {this.state.members.map((member, index) => {
                    return <LeaderboardMember key={index} member={member} />
                })}
            </div>
        );
    }
}

export default Leaderboard;