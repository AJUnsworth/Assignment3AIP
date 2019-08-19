import React from 'react';
import ProfilePhoto from '../images/profilepic.jpg'
import './ProfilePicture.css';

export class ProfilePicture extends React.Component {
    render () {
        return (
                <img src={ProfilePhoto} className="profilePicture" alt="profile"/>
        );
    }
}