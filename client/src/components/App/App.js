import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "../Home/Home";
import Thread from "../Thread/Thread";
import Login from "../Login/LogIn";
import User from "../User/User";

class App extends React.Component {
  render() {
    return (
      <Router>
        <Route path="/" exact component={Home}/>
        <Route path="/thread" component={Thread}/>
        <Route path="/login" component={Login}/>
        <Route path="/user" component={User}/>
      </Router>
    );
  }
}

export default App;