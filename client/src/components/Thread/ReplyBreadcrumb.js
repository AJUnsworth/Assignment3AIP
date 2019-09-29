import React from "react";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import PlaceholderImage from "../../images/imageremovedplaceholder.png";
import "./ReplyBreadcrumb.css";

class ReplyBreadcrumb extends React.Component {
    render() {
        return (
            <div>
                <h6 className="breadcrumbTitle">This image is part of the following thread</h6>
                <Breadcrumb>
                    <Breadcrumb.Item href="#"><img src={PlaceholderImage} className="breadcrumbImage" alt="placeholderimage"></img></Breadcrumb.Item>
                    <Breadcrumb.Item href="#"><img src={PlaceholderImage} className="breadcrumbImage" alt="placeholderimage"></img></Breadcrumb.Item>
                    <Breadcrumb.Item href="#"><img src={PlaceholderImage} className="breadcrumbImage" alt="placeholderimage"></img></Breadcrumb.Item>
                </Breadcrumb>
            </div>
        );


    }
}

export default ReplyBreadcrumb;