import React from 'react';
import { Navbar } from './components/Navbar';
import { LeaderboardMember } from './components/LeaderboardMember';
import { ContentFrame } from './components/ContentFrame';
import { ReactionCounter } from './components/ReactionCounter';

function App() {
  return (
    <div>
      <Navbar/>
      <ContentFrame>
        <LeaderboardMember/>
        <ReactionCounter/>
      </ContentFrame>
      
    </div>
  );
}

export default App;
