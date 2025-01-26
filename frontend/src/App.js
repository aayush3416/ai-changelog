import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChangelogGenerator from './ChangelogGenerator';
import PublicChangelog from './PublicChangelog';
import './ChangelogGenerator.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChangelogGenerator />} />
        <Route path="/changelogs" element={<PublicChangelog />} />
      </Routes>
    </Router>
  );
}

export default App;
