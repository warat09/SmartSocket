import {Suspense,lazy,useEffect,useState} from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import Layout from './layouts/app/applicationlayout';
import NotFoundLayout from './layouts/404/index'
import { Checktoken } from './services/apiservice';
// import Home from './view/home';
import Login from './view/login';

import Node from './view/node';

import {ListUser , NewUser} from './view/user';

import { ListAsset , NewAsset} from './view/assets';

import { ListMatch , NewMatch } from './view/match';

import Approve from './view/approve';

import UserMatch from './view/user_match';
// import Transection from './view/node_transection'
import Page404 from './view/Page404/Page404';
import Loading from './components/Loading';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import { List } from '@mui/icons-material';
const Dashboard = lazy( () => {
  return Promise.all([
    import('./view/dashboard/dashboard'),
    new Promise(resolve => setTimeout(resolve,3000))
  ]).then(
    (([moduleExports]) => moduleExports)
  )
});
// const Transection = lazy( () => {
//   return Promise.all([
//     import('./view/node_transection'),
//     new Promise(resolve => setTimeout(resolve,3000))
//   ]).then(
//     (([moduleExports]) => moduleExports)
//   )
// });


const Transection  = lazy(() => import('./view/node_transection'));


function Router(props:any){
    const userData:any = props.UserData;
    const routes:any = useRoutes([
        {
            path: '/app',
            element: <Layout UserData={userData} />,
            children: [
              { element: <Navigate to="/app/dashboard" />, index: true },
              { path: 'dashboard', element: 
              <Suspense fallback={
                <Loading/>
            }>
                <Dashboard />
              </Suspense>},
              { path: 'node', element: <Node /> },
              {
                path: 'user',
                children:[
                  { element: <Navigate to='/app/user/list'/>, index: true},
                  {path: 'list',element:
                  <Suspense fallback={
                    <Box sx={{ width: '100%' }}>
                      <Loading />
                    </Box>
                    }>
                    <ListUser />
                  </Suspense>
                  },
                  {path: 'new',element:
                  <Suspense fallback={
                    <Box sx={{ width: '100%' }}>
                      <Loading />
                    </Box>
                    }>
                    <NewUser />
                  </Suspense>
                  }
                ]
              },
              { path: 'asset',children: [
                { element: <Navigate to="/app/asset/list" />, index: true },
                {path: 'list',element: <ListAsset />},
                {path: 'new',element: <NewAsset />}
              ]},
              { path: 'match',children: [
                { element: <Navigate to="/app/match/list" />, index: true },
                {path: 'list',element: <ListMatch />},
                {path: 'new',element: <NewMatch />}
              ]},
              { path: 'approve',children: [
                { element: <Navigate to="/app/approve/list" />, index: true },
                {path: 'list',element: <Approve />}
              ]},
              // { path: 'transaction', element:
              //  <Suspense fallback={
              //   <Box sx={{ width: '100%' }}>
              //     <Loading />
              //   </Box>
              //  }>
              //   <Transection />
              // </Suspense> },
              { path: 'transaction' ,children:[
                { element: <Navigate to='/app/transaction/list'/>, index: true},
                {path: 'list',element:
                <Suspense fallback={
                  <Box sx={{ width: '100%' }}>
                    <Loading />
                  </Box>
                  }>
                  <Transection />
                </Suspense>
              }
              ]}
            ],
          },
          { path: 'usermatch', element: <UserMatch /> },
          {
            path: 'login',
            element: <Login />,
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
