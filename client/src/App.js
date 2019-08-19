import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./components/Home";
import {Thread} from "./components/Thread";

class App extends React.Component {
  render() {
    return (
      <Router>
        <Route path="/" exact component={Home}/>
        <Route path="/thread" component={Thread}/>
      </Router>
    );
  }
}

export default App;