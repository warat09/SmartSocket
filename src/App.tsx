import {Suspense,lazy,useEffect,useState} from 'react';
import { Checktoken } from './services/apiservice';
// import Router from './routes';
import Loading from './components/Loading';
import { Helmet } from 'react-helmet-async';
import ThemeProvider from './theme';

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
  // const [userData,setUserData] = useState<Object>({})
  // useEffect(() => {
  //   const item = localStorage.getItem("User");
  //   if (item && item !== "undefined") {
  //     const user = JSON.parse(item);
  //     Checktoken("/User/CheckToken",user.token).then((response) => {
  //       if (response.status === "ok") {
  //         setUserData(response.data)
  //         console.log(response.data)
  //       } 
  //       // else {
  //       //   localStorage.clear();
  //       // }
  //     });
  //   } 
  //   // else {
  //   //   navigate("/login");
  //   // }
  // }, []);
  return (
    
    <ThemeProvider>
      <Helmet>
        <style>{"body { background-color: #F5F5F5; }"}</style>
      </Helmet>
      <Suspense fallback={<Loading/>}>
        <Router />
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
