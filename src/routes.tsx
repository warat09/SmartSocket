import {Suspense,lazy,useEffect,useState} from 'react';
import { Navigate, useRoutes, Route, Routes } from 'react-router-dom';
import LayoutAdmin from './layouts/app/adminlayout';
import LayoutUser from './layouts/app/userlayout';
import NotFoundLayout from './layouts/404/index'
import Home from './view/home';
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


const Router: React.FC =()=> {
  // return(
  //   <Routes>
  //     <Route index path={"/"} element={<Home/>}/>
  //     <Route path={"login"} element={<Login/>} />
  //       {/* <Route index element={<Navigate to="/login"/>}/>
        
  //     </Route> */}
      
  //     {/* <Route path={"/app"} element={<CreateAccount />} /> */}
  //     <Route path={"/app/personnel"} element={<LayoutUser/>}>
  //       <Route index element={<Navigate to="/app/personnel/borrow" />}/>
  //       <Route path={"borrow"} element={<UserMatch/>} />
  //     </Route>

  //     <Route path={"/app/admin"} element={<LayoutAdmin/>}>
  //       {/* <Route index element={<Navigate to="/app/admin/dashboard" />}/> */}
  //       <Route index path={"dashboard"} element={<Dashboard/>} />
  //       <Route path={"socket"} element={<Node/>} />
  //       <Route path={"user"}>
  //         <Route index element={<Navigate to="/app/admin/user/list" />}/>
  //         <Route path={"list"} element={<ListUser/>}/>
  //         <Route path={"new"} element={<NewUser/>}/>
  //       </Route>
  //       <Route path={"asset"}>
  //         <Route index element={<Navigate to="/app/admin/asset/list" />}/>
  //         <Route path={"list"} element={<ListAsset/>}/>
  //         <Route path={"new"} element={<NewAsset/>}/>
  //       </Route>
  //       <Route path={"match"}>
  //         <Route index element={<Navigate to="/app/admin/match/list" />}/>
  //         <Route path={"list"} element={<ListMatch/>}/>
  //         <Route path={"new"} element={<NewMatch/>}/>
  //       </Route>
  //       <Route path={"approve"} element={<Approve/>}/>
  //       <Route path={"transaction"} element={<Transection/>}/>
  //     </Route>
  //     <Route element={<NotFoundLayout/>}>
  //       <Route index element={<Navigate to="/app" />}/>
  //       <Route path={"404"} element={<Page404/>} />
  //       <Route path={"*"} element={ <Navigate to="/404" />} />
  //     </Route>
  //     <Route path="*" element={<Navigate to="/404" replace/>} />
  //   </Routes>
  // );
  
    const routes:any = useRoutes([
        {
            path: '/',
            element: <Home/>,
            index:true
        },
        {
            path: '/app/admin',
            element: <LayoutAdmin />,
            children: [
              { element: <Navigate to="/app/admin/dashboard" />, index: true },
              { path: 'dashboard', element: 
              <Suspense fallback={
                <Loading/>
            }>
                <Dashboard />
              </Suspense>},
              { path: 'socket', element: <Node /> },
              {
                path: 'user',
                children:[
                  { element: <Navigate to='/app/admin/user/list'/>, index: true},
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
                { element: <Navigate to="/app/admin/asset/list" />, index: true },
                {path: 'list',element: <ListAsset />},
                {path: 'new',element: <NewAsset />}
              ]},
              { path: 'match',children: [
                { element: <Navigate to="/app/admin/match/list" />, index: true },
                {path: 'list',element: <ListMatch />},
                {path: 'new',element: <NewMatch />}
              ]},
              { path: 'approve',children: [
                { element: <Navigate to="/app/admin/approve/list" />, index: true },
                {path: 'list',element: <Approve />}
              ]},
              { path: 'transaction' ,children:[
                { element: <Navigate to='/app/admin/transaction/list'/>, index: true},
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
          { path: '/app/personnel', 
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
