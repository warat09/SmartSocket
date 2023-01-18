import React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import Layout from './view/layouts/applicationlayout';
import Home from './view/home';
import Login from './view/login';
import Node from './view/node';
import Asset from './view/assets';
import Matching from './view/match';
import Approve from './view/approve';
import UserMatch from './view/user_match';
import Transection from './view/node_transection'
import Register from './view/register';

const Router: React.FC =()=>  {
    const routes:any = useRoutes([
        {
            path: '/app',
            element: <Layout />,
            children: [
              { element: <Navigate to="/app/dashboard" />, index: true },
              { path: 'dashboard', element: <Home /> },
              { path: 'node', element: <Node /> },
              { path: 'asset', element: <Asset /> },
              { path: 'match', element: <Matching /> },
              { path: 'approve', element: <Approve /> },
              { path: 'usermatch', element: <UserMatch /> },
              { path: 'transaction', element: <Transection /> },
            ],
          },
          {
            path: 'login',
            element: <Login />,
          },
          {
            path: 'register',
            element: <Register />,
          },
      ]);
    return routes;
}
export default Router;
