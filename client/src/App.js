import React from 'react';
import { Navbar } from './components/Navbar';
import { ContentFrame } from './components/ContentFrame';
import { ReactionCounter } from './components/ReactionCounter';

function App() {
  return (
    <div>
      <Navbar/>
      <ContentFrame/>
    </div>
  );
}

export default App;
