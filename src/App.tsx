import React from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Navbar from './view/Navbar';
import Dashboard from './view/Dashboard';
import Login from './view/Userlogin';
import HomeNode from './view/node';
import HomeAsset from './view/assets';
import Matching from './view/match';
import UserMatch from './view/user_match';
import Transection from './view/node_transection'
import Register from './view/user/create_use';
const App: React.FC =()=> {
  return (
    <div>
      <Router>
      <Navbar/>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/node" element={<HomeNode/>}/>
          <Route path="/asset" element={<HomeAsset/>}/>
          <Route path="/match" element={<Matching/>}/>
          <Route path="/usermatch" element={<UserMatch/>}/>
          <Route path="/transection" element={<Transection/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
