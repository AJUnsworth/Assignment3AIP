import React from 'react';
import { Navbar } from './components/Navbar';
import { ContentFrame } from './components/ContentFrame';
import { Leaderboard } from './components/Leaderboard';

function App() {
  return (
    <div>
      <Navbar/>
      <ContentFrame>
        <Leaderboard/>
      </ContentFrame>
      
    </div>
  );
}

export default App;
