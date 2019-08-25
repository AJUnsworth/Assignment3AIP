import React from 'react';
import Navbar from '../Navbar/Navbar';
import ContentFrame from '../Image/ContentFrame';

 class Home extends React.Component {
    constructor(){
    super()
    this.state = {members:[]}; 
    }
    componentDidMount(){
        const self=this;
        console.log("this is working")
        fetch('http://localhost:4000/leaderboard') //https://developers.google.com/web/updates/2015/03/introduction-to-fetch
  .then(
    //handling error
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }

      // Converts the response to json and set members to the data
      response.json().then(function(data) {
        self.setState({members: data});
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });

    }
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
            <ContentFrame members={this.state.members}/>
        </div>
    );
}
}


export default Home;