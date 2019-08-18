import React from 'react';
import './ReactionCounter.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments } from '@fortawesome/free-solid-svg-icons'

export class ReactionCounter extends React.Component {
    render() {
        return (
            <div class="reactionCounter">
                <FontAwesomeIcon icon={faComments} className="elementSpacing"/>
                <label className="elementSpacing">Test</label>
            </div>
        );
    }
}