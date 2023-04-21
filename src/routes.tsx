import {Suspense,lazy} from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import LayoutAdmin from './layouts/app/adminlayout';
import LayoutUser from './layouts/app/userlayout';
import NotFoundLayout from './layouts/404/index'
import Home from './view/home';
import Login from './view/login';

import Register from './view/register/register';

import ForgotPassword from './view/forgotpassword';

import UserMatch from './view/user_match';
// import Transection from './view/node_transection'
import Page404 from './view/Page404/Page404';

import Loading from './components/Loading';

import Box from '@mui/material/Box';
// const Dashboard = lazy( () => {
//   return Promise.all([
//     import('./view/dashboard/dashboard'),
//     new Promise(resolve => setTimeout(resolve,1000))
//   ]).then(
//     (([moduleExports]) => moduleExports)
//   )
// });

const Dashboard  = lazy(() => import('./view/dashboard'));

const Socket  = lazy(() => import('./view/socket'));

const User  = lazy(() => import('./view/user'));

const Asset  = lazy(() => import('./view/assets'));

const Match  = lazy(() => import('./view/match'));

const Approve  = lazy(() => import('./view/approve'));

const Maintenance  = lazy(() => import('./view/maintenance/Maintenance'));

const Transection  = lazy(() => import('./view/node_transection'));

const Router: React.FC =()=> {
  
    const routes:any = useRoutes([
        {
            path: '/',
            element: <Home/>,
            index:true
        },
        {
            path: 'app/admin',
            element: <LayoutAdmin />,
            children: [
              { path: 'dashboard',element: 
              <Suspense fallback={<Loading/>}>
                <Dashboard />
              </Suspense>, index: true },
              { path: 'socket', element:
              <Suspense fallback={
                <Box sx={{ width: '100%' }}>
                  <Loading />
                </Box>
                }>
                <Socket />
              </Suspense> 
              },
              {
                path: 'user',element: 
                <Suspense fallback={
                  <Box sx={{ width: '100%' }}>
                    <Loading />
                  </Box>
                  }>
                  <User />
                </Suspense>
              },
              { path: 'asset',element: 
              <Suspense fallback={
                <Box sx={{ width: '100%' }}>
                  <Loading />
                </Box>
                }>
                <Asset />
              </Suspense>},
              { path: 'match',element: 
              <Suspense fallback={
                <Box sx={{ width: '100%' }}>
                  <Loading />
                </Box>
                }>
                <Match />
              </Suspense> 
              },
              { path: 'approve',element:
              <Suspense fallback={
                <Box sx={{ width: '100%' }}>
                  <Loading />
                </Box>
                }>
                <Approve />
              </Suspense>
              },
              { path: 'maintenance',element:
              <Suspense fallback={
                <Box sx={{ width: '100%' }}>
                  <Loading />
                </Box>
                }>
                <Maintenance />
              </Suspense>
              },
              { path: 'transaction' ,element:
              <Suspense fallback={
                <Box sx={{ width: '100%' }}>
                  <Loading />
                </Box>
                }>
                <Transection />
              </Suspense>
              }
            ],
          },
          { path: 'app/personnel', 
            element: <LayoutUser /> , 
            children: [
              { element: <Navigate to="/app/personnel/borrow" />, index: true },
              { path: 'borrow', element: 
              <Suspense fallback={<Loading/>}>
                <UserMatch />
              </Suspense>},
            ]
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
            path: 'forgotpassword',
            element: <ForgotPassword />
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
