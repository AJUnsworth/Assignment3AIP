import React from 'react';
import Navbar from './Navbar';
import ThreadImage from './ThreadImage';
import ProfilePicture from './ProfilePicture';
import ImageGrid from './ImageGrid';
import ReactionGrid from './ReactionGrid';
import './Thread.css';

class Thread extends React.Component {
    render () {
        return (
            <div>
            <Navbar/>
                <div className="content">
                <ThreadImage/>
                    <div className="sidebar">
                    <ProfilePicture className="profilePicture"/>
                    <h1 className="profileName">Post by</h1>
                    <h1 className="profileName">johnsmith123</h1>
                    <ReactionGrid class="reactionGrid"/>
                    </div>

                    <div className="comments">
                        <h2 className="commentsText">Comments</h2>
                        <ImageGrid/>
                        </div>
                </div>
            </div>
        );
    }
}

export default Thread;