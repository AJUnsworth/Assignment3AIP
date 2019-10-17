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
            currentUser: null,
            loading: false
        };
    }


    async componentDidMount() {
        if (!this.state.currentUser) {
            const response = await fetch("/users/current", {
                method: "GET"
            });

            if (response.status === 200) {
                const data = await response.json();
                this.setUser(data);
            } else if (response.status === 401) {
                this.props.history.push("/login");
            }
        }
    }

    setUser = userData => {
        this.setState({ currentUser: userData });
    }

    logout = async () => {
        this.setState({ loading: true });
        await fetch("/users/logout", {
            method: "POST"
        });

        this.setState({
            currentUser: null,
            loading: false
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
                    <Route path="/login" render={(props) => <AuthenticationContainer {...props} setUser={this.setUser} logout={this.logout} />} />
                    <Route path="/user/:userId" render={(props) => <User {...props} currentUser={this.state.currentUser} logout={this.logout} />} />
                    <Route render={(props) => <MissingPage {...props} currentUser={this.state.currentUser} logout={this.logout} />} />
                </Switch>
                <NotificationContainer />
            </Router>
        );
    }
}

export default App;