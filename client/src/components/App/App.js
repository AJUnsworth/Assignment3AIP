import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { NotificationContainer } from "react-notifications";
import "./App.css";
import "react-notifications/lib/notifications.css";

import Home from "../Home/Home";
import Admin from "../Admin/Admin";
import Thread from "../Thread/Thread";
import AuthenticationContainer from "../Login/AuthenticationContainer";
import User from "../User/User";
import MissingPage from "../MissingPage/MissingPage";

class App extends React.Component {
    constructor() {
        super();
        this.state = { 
            currentUser: null };
    }


    async componentDidMount() {
        //Gets a user"s details on login if there is none currently set
        //Does not set currentUser if token does not exist or is invalid
        if (!this.state.currentUser) {
            const response = await fetch("/api/users/current", {
                method: "GET"
            });

            if (response.status === 200) {
                const data = await response.json();
                this.setUser(data);
            }
        }
    }

    setUser = userData => {
        this.setState({ currentUser: userData });
    }

    //Removes user"s token/cookie and clears currentUser
    logout = async () => {
        await fetch("/api/users/logout", {
            method: "GET"
        });

        this.setState({ currentUser: null });
    };


    render() {
        return (
            < Router >
                <Switch>
                    {/*Router for website, sends current user and logout to specified routes
                        Code for passing props to routes is based on an example by Tyler McGinnis. 
                        See https://tylermcginnis.com/react-router-pass-props-to-components/*/}
                    <Route path="/" exact render={(props) => <Home {...props} currentUser={this.state.currentUser} logout={this.logout} />} />
                    <Route path="/admin" render={(props) => <Admin {...props} currentUser={this.state.currentUser} logout={this.logout} />} />
                    <Route path="/thread/:postId" render={(props) => <Thread {...props} currentUser={this.state.currentUser} logout={this.logout} />} />
                    <Route path="/login" render={(props) => <AuthenticationContainer {...props} setUser={this.setUser} logout={this.logout} />} />
                    <Route path="/user/:userId" render={(props) => <User {...props} currentUser={this.state.currentUser} logout={this.logout} />} />
                    <Route render={(props) => <MissingPage {...props} currentUser={this.state.currentUser} logout={this.logout} />} />
                </Switch>
                <NotificationContainer />
            </Router >
        );
    }
}

export default App;