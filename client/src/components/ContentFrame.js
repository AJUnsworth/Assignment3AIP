import React from 'react';
import './ContentFrame.css';

// Containment Function - taken from React.js.org documentation
// https://reactjs.org/docs/composition-vs-inheritance.html

export function ContentFrame(props) {
    return (
        <div className="contentFrame">
            {props.children}
        </div>
    );
}
