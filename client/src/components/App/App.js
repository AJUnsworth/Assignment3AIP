import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { NotificationContainer } from "react-notifications";
import "./App.css";
import "react-notifications/lib/notifications.css";

import Home from "../Home/Home";
import Thread from "../Thread/Thread";
import LoginContainer from "../Login/LoginContainer";
import User from "../User/User";

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            currentUser: null
        };
    }

    componentDidMount() {
        const self = this;
        if (!this.state.currentUser) {
            fetch("/users/getCurrentUser", {
                method: "GET"
            })
                .then(response => {
                    if (response.status === 200) {
                        response.json().then(data => {
                            self.setUser(data);
                        });
                    }
                });
        }
    }

    setUser = userData => {
        localStorage.setItem("User", JSON.stringify(userData));
        this.setState({ currentUser: userData });
    }

    logout = () => {
        const self = this;
        fetch("/users/logout", {
            method: "POST"
        })
            .then(function (response) {
                localStorage.removeItem("User");
                self.setState({ currentUser: null });
            });
    };

    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/" exact render={(props) => <Home {...props} currentUser={this.state.currentUser} logout={this.logout} />} />
                    <Route path="/thread/:postId" render={(props) => <Thread {...props} currentUser={this.state.currentUser} logout={this.logout} />} />
                    <Route path="/login" render={(props) => <LoginContainer {...props} setUser={this.setUser} logout={this.logout} />} />
                    <Route path="/user" render={(props) => <User {...props} currentUser={this.state.currentUser} logout={this.logout} />} />
                </Switch>
                <NotificationContainer />
            </Router>
        );
    }
}

export default App;