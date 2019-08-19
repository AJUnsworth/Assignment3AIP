import React from 'react';
import './Welcome.css';
import { ProfilePicture } from './User/ProfilePicture';

export class Welcome extends React.Component {
    render () {
        return (
            <div className="container">
                <h1 className="welcomeMessage">Welcome johnsmith123</h1>
                <div className="welcomeImage">
                    <ProfilePicture/>
                </div>
            </div>
        );
    }
}

export default Welcome;