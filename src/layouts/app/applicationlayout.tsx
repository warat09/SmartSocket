import {Dispatch,SetStateAction,useState,useEffect} from 'react';
import { Outlet } from 'react-router-dom';
// import Sidebar from '../../components/Siderbar/Sidebar';
import TestSidebar from '../../components/Siderbar/TestSidebar'
import Navbar from '../../components/Navbar/Navbar'
import NavbarUser from '../../components/Navbar/NavbarUser'
import MenuA from '../../Menus/MenuA';
import ContentHolder from "./contentholder";
import Nav from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Siderbar/NewSidebar';
import { styled } from '@mui/material/styles';
import {
  Box,
  Toolbar
} from "@mui/material";
import { Checktoken } from "../../services/apiservice";


export interface ComponentLayoutApp {
    drawer:JSX.Element
    setDrawer:Dispatch<React.SetStateAction<JSX.Element>>
}

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));
const AppLayout: React.FC =()=> {
  // const StyledRoot = styled('div')({
  //   display: 'flex',
  //   minHeight: '100%',
  //   overflow: 'hidden',
  // });
  const [role,setrole] = useState<string>("")
  const [open, setOpen] = useState(false);
  const [userData,setUserDate] = useState<Object>({})
  // const [menuDrawer,setMenuDrawer] = useState<JSX.Element>(<MenuA />)
  // const drawer = (
  //   <div>
  //     <Toolbar />
  //     {menuDrawer}
  //   </div>
  // )

  // const outlet = (
  //   <div>
  //     <Outlet />
  //   </div>
  // )
  useEffect(() => {
    const item = localStorage.getItem("User");
    if (item && item !== "undefined") {
      const user = JSON.parse(item);
      Checktoken(user.token).then((response)=>{
        const dataresponse = response.data[0]
        if (response.status === "ok") {
          setrole(dataresponse.name)
          setUserDate({
            name:dataresponse.name,surname:dataresponse.surname,username:dataresponse.username,
            email:dataresponse.email,role:dataresponse.role,departure:dataresponse.departure
          })
        } else {
          localStorage.clear();
        }
      })
      // .then((status) => {
      //   console.log(status)
      //   if (status === true) {
      //     console.log(user)
      //   } else {
      //     localStorage.clear();
      //   }
      // });
    } 
    // else {
    //   navigate("/login");
    // }
  }, []);
  console.log(userData)
  return (
    <StyledRoot>
      <Nav data={userData} onOpenNav={() => setOpen(true)} />
      <Sidebar data={userData} openNav={open} onCloseNav={() => setOpen(false)} />
      <Main>
        <Outlet />
      </Main>
    </StyledRoot>
    // <StyledRoot>
    // {role === "admin" &&
    // // <ContentHolder>
    //   <>
    //     <TestNavbar Outlet={outlet} drawer={menuDrawer}/>
    //       {/* <Navbar Outlet={Outlet}  drawer={menuDrawer} setDrawer={setMenuDrawer}/>
    //       <Sidebar drawer={drawer} drawerWidth={220}/>
    //       <Outlet/> */}
    //   </>
    //   // </ContentHolder>
    //   }
    //   {role === "user" &&
    //     <>
    //         <NavbarUser  drawer={menuDrawer} setDrawer={setMenuDrawer}/>
    //         <Outlet/>
    //     </>
    //   }
    // </StyledRoot>
  );
}

export default AppLayout;
