import React from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Dashboard from './view/Dashboard';
import Login from './view/Userlogin';
import HomeNode from './view/node';
import HomeAsset from './view/assets';
import Matching from './view/match';
import Approve from './view/approve';
import UserMatch from './view/user_match';
import Transection from './view/node_transection'
import Register from './view/user/create_use';
import Layout from './view/layouts/applicationlayout';

const App: React.FC =()=> {
  return (
    <>
      <Router>
        <Routes>
          <Route path={"login"} element={<Login/>} />
          <Route path={"register"} element={<Register/>} />
          <Route path={"/"} element={<Layout/>}>
            <Route index element={<Dashboard/>}/>
            <Route path={"node"} element={<HomeNode/>}/>
            <Route path={"asset"} element={<HomeAsset/>}/>
            <Route path={"match"} element={<Matching/>}/>
            <Route path={"approve"} element={<Approve/>}/>
            <Route path={"usermatch"} element={<UserMatch/>}/>
            <Route path={"transaction"} element={<Transection/>}/>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
