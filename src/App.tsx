import React from 'react';
import {HashRouter as Router, Route, Routes} from "react-router-dom";

import Dashboard from './view/Dashboard';

const App: React.FC =()=> {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
