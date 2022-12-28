import React from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from './view/home';
import Login from './view/login';
import Node from './view/node';
import Asset from './view/assets';
import Matching from './view/match';
import Approve from './view/approve';
import UserMatch from './view/user_match';
import Transection from './view/node_transection'
import Register from './view/register';
import Test from './view/test/index'
import Layout from './view/layouts/applicationlayout';

const App: React.FC =()=> {
  return (
    <>
      <Router>
        <Routes>
          <Route path={"login"} element={<Login/>} />
          <Route path={"register"} element={<Register/>} />
          <Route path={"/"} element={<Layout/>}>
            <Route index element={<Home/>}/>
            <Route path={"node"} element={<Node/>}/>
            <Route path={"asset"} element={<Asset/>}/>
            <Route path={"match"} element={<Matching/>}/>
            <Route path={"approve"} element={<Approve/>}/>
            <Route path={"usermatch"} element={<UserMatch/>}/>
            <Route path={"transaction"} element={<Transection/>}/>
            <Route path={"test"} element={<Test/>}/>

          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
