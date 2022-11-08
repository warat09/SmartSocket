import React from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Navbar from './view/Navbar';
import Dashboard from './view/Dashboard';
import Login from './view/Userlogin';
import HomeNode from './view/node/index_match';
import HomeAsset from './view/assets/index_assets';
import CreateAssets from './view/assets/create_assets';
import Matching from './view/match/index_match'
const App: React.FC =()=> {
  return (
    <div>
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="login" element={<Login/>} />
          <Route path="node" element={<HomeNode/>}/>
          <Route path="asset" element={<HomeAsset/>}/>
          <Route path="createasset" element={<CreateAssets/>}/>
          <Route path="matching" element={<Matching/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
