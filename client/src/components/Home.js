import React from 'react';
import { Navbar } from './Navbar';
import { ContentFrame } from './ContentFrame';

function Home() {
    const members = [
        {name: 'Andrew', rank: '#1'},
        {name: 'Bela', rank: '#2'},
        {name: 'Chloe', rank: '#3'},
        {name: 'James', rank: '#4'},
        {name: 'Josh', rank: '#5'}
    ];

    return (
        <div>
            <Navbar/>
            <ContentFrame members={members}/>
        </div>
    );
}

export default Home;