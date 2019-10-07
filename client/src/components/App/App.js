import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { NotificationContainer } from "react-notifications";
import "./App.css";
import "react-notifications/lib/notifications.css";

import Home from "../Home/Home";
import Admin from "../Admin/Admin";
import Thread from "../Thread/Thread";
import LoginContainer from "../Login/LoginContainer";
import User from "../User/User";
import MissingPage from "../MissingPage/MissingPage";

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            currentUser: null,
            loading: false
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
                    } else if (response.status === 401 && response === "Invalid token") {
                        this.props.history.push("/login");
                    }
                });
        }
    }

    setUser = userData => {
        this.setState({ currentUser: userData });
    }

    logout = () => {
        this.setState({ loading: true });
        const self = this;
        fetch("/users/logout", {
            method: "POST"
        })
            .then(function (response) {
                self.setState({ 
                    currentUser: null, 
                    loading: false 
                });
            });
    };
    

    render() {
        return (
            
            <Router>
                <Switch>
                    {/*Code for passing props to routes is based on an example by Tyler McGinnis. 
                        See https://tylermcginnis.com/react-router-pass-props-to-components/*/}
                    <Route path="/" exact render={(props) => <Home {...props} currentUser={this.state.currentUser} logout={this.logout} />} />
                    <Route path="/admin" render={(props) => <Admin {...props} currentUser={this.state.currentUser} logout={this.logout} />} />
                    <Route path="/thread/:postId" render={(props) => <Thread {...props} currentUser={this.state.currentUser} logout={this.logout} />} />
                    <Route path="/login" render={(props) => <LoginContainer {...props} setUser={this.setUser} logout={this.logout} />} />
                    <Route path="/user/:userId" render={(props) => <User {...props} currentUser={this.state.currentUser} logout={this.logout} />} />   
                    <Route render={(props) => <MissingPage {...props} currentUser={this.state.currentUser} logout={this.logout} />} />
                </Switch>
                <NotificationContainer />
            </Router>
        );
    }
}

export default App;