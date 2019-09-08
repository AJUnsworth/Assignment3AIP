import React from "react";
import Navbar from "../Navbar/Navbar";

import ContentFrame from "../Image/ContentFrame";

class Home extends React.Component {
    render() {
        return (
            <div>
                <Navbar />
                <ContentFrame />
            </div>
        );
    }
}


export default Home;