import React from 'react';
import './ReactionGrid.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGrinHearts, faGrinSquint, faSadCry, faSurprise, faAngry, faThumbsUp} from '@fortawesome/free-solid-svg-icons'

export class ReactionGrid extends React.Component {
    render () {
        return (
           <div className="reactionGrid">
               <table className="reactionTable">
                   <tr>
                       <td><FontAwesomeIcon icon={faThumbsUp} className="fa-3x"/><h1 class="reactionCount">12</h1></td>
                       <td><FontAwesomeIcon icon={faGrinSquint} className="fa-3x"/><h1 class="reactionCount">12</h1></td>
                       <td><FontAwesomeIcon icon={faGrinHearts} className="fa-3x"/><h1 class="reactionCount">12</h1></td>
                   </tr>
                   <tr>
                        <td><FontAwesomeIcon icon={faSurprise} className="fa-3x"/><h1 class="reactionCount">12</h1></td>
                        <td><FontAwesomeIcon icon={faSadCry} className="fa-3x"/><h1 class="reactionCount">12</h1></td>
                        <td><FontAwesomeIcon icon={faAngry} className="fa-3x"/><h1 class="reactionCount">12</h1></td>
                   </tr>
               </table>

            </div>
        );
    }
}