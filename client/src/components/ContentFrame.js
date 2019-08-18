import React from 'react';
import './ContentFrame.css';
import { Leaderboard } from './Leaderboard';

// Containment Function - taken from React.js.org documentation
// https://reactjs.org/docs/composition-vs-inheritance.html

export function ContentFrame() {
    return (
        <div className="contentFrame">
            <Leaderboard/>
        </div>
    );
}
