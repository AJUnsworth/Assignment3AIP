import React from 'react';
import './ReactionCounter.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments, faHeart } from '@fortawesome/free-solid-svg-icons'
import Badge from 'react-bootstrap/Badge'

export class ReactionCounter extends React.Component {
    render() {
        return (
            <Badge pill variant="light">
                <FontAwesomeIcon icon={faComments} className="iconSpacing text-primary"/>
                8   
                <FontAwesomeIcon icon={faHeart} className="iconSpacing rhsIcon text-danger"/>
                57
            </Badge>
        );
    }
}