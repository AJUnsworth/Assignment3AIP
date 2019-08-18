import React from 'react';
import { Navbar } from './components/Navbar';
import { LeaderboardMember } from './components/LeaderboardMember';
import { ContentFrame } from './components/ContentFrame';

function App() {
  return (
    <div>
      <Navbar/>
      <ContentFrame>
        <LeaderboardMember/>
      </ContentFrame>
      
    </div>
  );
}

export default App;
