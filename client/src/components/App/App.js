import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
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
                <Route path="/" exact component={Home} />
                <Route path="/thread" component={Thread} />
                <Route path="/loginContainer" component={LoginContainer} />
                <Route path="/user" component={User} />
            </Router>
            <NotificationContainer/>
            </div>
            
        );
    }
}

export default App;