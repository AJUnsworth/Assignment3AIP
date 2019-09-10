import React from "react";
import Navbar from "../Navbar/Navbar";

import ContentFrame from "../Image/ContentFrame";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: ""
        }
    }

    componentDidMount() {
        //Convert user details from string to a JSON object to be able to access properties
        const user = JSON.parse(localStorage.getItem("User"));
        if (user) {
            this.setState({ username: user.username });
        }
    }

    render() {
        return (
            <div>
                <Navbar />
                <ContentFrame username={this.state.username} />
            </div>
        );
    }
}

export default Home;