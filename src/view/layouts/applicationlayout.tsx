import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar'
const AppLayout: React.FC =()=> {
  return (
    <>
        <Navbar/>
        <Outlet/>
    </>
  );
}

export default AppLayout;
