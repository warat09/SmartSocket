import {Suspense,lazy,useEffect,useState} from 'react';
import { Checktoken } from './services/apiservice';
// import Router from './routes';
import Loading from './components/Loading';
import { Helmet } from 'react-helmet-async';
import ThemeProvider from './theme';
import { HashRouter } from 'react-router-dom';

const Router = lazy( () => {
  return Promise.all([
    import('./routes'),
    new Promise(resolve => setTimeout(resolve,2000))
  ]).then(
    (([moduleExports]) => moduleExports)
  )
});
// const Router = lazy(() => import("./routes"));

const App: React.FC =()=> {
  return (
    
    <ThemeProvider>
      <Helmet>
        <style>{"body { background-color: #f2f5f9; }"}</style>
      </Helmet>
      <Suspense fallback={<Loading/>}>
        <Router />
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
