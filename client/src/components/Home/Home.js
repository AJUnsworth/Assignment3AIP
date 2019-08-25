import React from 'react';
import Navbar from '../Navbar/Navbar';
import ContentFrame from '../Image/ContentFrame';

 class Home extends React.Component {
    
    render () {
    /*const members = [
        {name: 'Andrew', rank: '#1'},
        {name: 'Bela', rank: '#2'},
        {name: 'Chloe', rank: '#3'},
        {name: 'James', rank: '#4'},
        {name: 'Josh', rank: '#5'}
    ];*/

    return (
        <div>
            <Navbar/>
            <ContentFrame/>
        </div>
    );
}
}


export default Home;