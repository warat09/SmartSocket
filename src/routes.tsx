import {Suspense,lazy,useEffect,useState} from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import Layout from './layouts/app/applicationlayout';
import NotFoundLayout from './layouts/404/index'
// import Home from './view/home';
import Login from './view/login';
import Node from './view/node';
import Asset from './view/assets';
import Matching from './view/match';
import Approve from './view/approve';
import UserMatch from './view/user_match';
// import Transection from './view/node_transection'
import Register from './view/register';
import Page404 from './view/Page404/Page404';
import Loading from './components/Loading';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
const Dashboard = lazy( () => {
  return Promise.all([
    import('./view/home'),
    new Promise(resolve => setTimeout(resolve,3000))
  ]).then(
    (([moduleExports]) => moduleExports)
  )
});
const Transection = lazy( () => {
  return Promise.all([
    import('./view/node_transection'),
    new Promise(resolve => setTimeout(resolve,3000))
  ]).then(
    (([moduleExports]) => moduleExports)
  )
});


// const Transection  = lazy(() => import('./view/node_transection'));


const Router: React.FC =()=>  {
    const routes:any = useRoutes([
        {
            path: '/app',
            element: <Layout />,
            children: [
              { element: <Navigate to="/app/dashboard" />, index: true },
              { path: 'dashboard', element: 
              <Suspense fallback={
                <Loading/>
            }>
                <Dashboard />
              </Suspense>},
              { path: 'node', element: <Node /> },
              { path: 'asset', element: <Asset /> },
              { path: 'match', element: <Matching /> },
              { path: 'approve', element: <Approve /> },
              { path: 'usermatch', element: <UserMatch /> },
              { path: 'transaction', element:
               <Suspense fallback={
                <Box sx={{ width: '100%' }}>
                  <Loading />
                </Box>
               }>
                <Transection />
              </Suspense> },
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
          {
            element: <NotFoundLayout />,
            children: [
              { element: <Navigate to="/app/dashboard" />, index: true },
              { path: '404', element: <Page404 /> },
              { path: '*', element: <Navigate to="/404" /> },
            ],
          },
          {
            path: '*',
            element: <Navigate to="/404" replace />,
          },
      ]);
    return routes;
}
export default Router;
