import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./components/Home";
import Thread from "./components/Thread";
import Login from "./components/LogIn";
import User from "./components/User";

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