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
    render() {
        return (
            <div>
            <Router>
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/thread/:postId" component={Thread} />
                    <Route path="/login" component={LoginContainer} />
                    <Route path="/user" component={User} />
                </Switch>
            </Router>
            <NotificationContainer/>
            </div>
            
        );
    }
}

export default App;