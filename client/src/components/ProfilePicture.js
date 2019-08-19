import React from 'react';
import { Link } from 'react-router-dom';
import ProfilePhoto from '../images/profilepic.jpg';
import './ProfilePicture.css';

export class ProfilePicture extends React.Component {
    render () {
        return (
            <Link to="/user/">
                <img src={ProfilePhoto} className="profilePicture" alt="profile"/>
            </Link>
        );
    }
}

export default ProfilePicture;