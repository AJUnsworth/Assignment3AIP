import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faHeart, faUpload } from "@fortawesome/free-solid-svg-icons";

import Navbar from "../Navbar/Navbar";
import ProfilePicture from "../User/ProfilePicture";
import "./User.css";

class User extends React.Component {
    render() {
        return (
            <div>
                <Navbar />
                <div className="UserContainer">
                    <table>
                        <tr>
                            <td><div className="ProfilePic"><ProfilePicture /></div></td>
                            <td className="rightColumn"><h1>johnsmith123</h1>
                                <table className="rightInfo">
                                    <tr>
                                        <td><h2>12</h2></td>
                                        <td><h2>12</h2></td>
                                        <td><h2>12</h2></td>
                                    </tr >
                                    <tr>
                                        <td><FontAwesomeIcon icon={faUpload} className="iconSpacing text-primary" />Posts</td>
                                        <td><FontAwesomeIcon icon={faComments} className="iconSpacing text-primary" />Comments</td>
                                        <td><FontAwesomeIcon icon={faHeart} className="iconSpacing rhsIcon text-danger" />Reacts</td>
                                    </tr>

                                </table>
                            </td>
                        </tr>
                    </table>

                </div>
            </div>
        );
    }
}

export default User;