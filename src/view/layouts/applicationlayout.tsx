import {Dispatch,SetStateAction,useState,useEffect} from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Siderbar/Sidebar';
import TestSidebar from '../../components/Siderbar/TestSidebar'
import Navbar from '../../components/Navbar/Navbar'
import TestNavbar from '../../components/Navbar/TestNavnbar'
import NavbarUser from '../../components/Navbar/NavbarUser'
import MenuA from '../../Menus/MenuA';
import ContentHolder from "../../view/layouts/contentholder";
import {
  Box,
  Toolbar
} from "@mui/material";
import { Checktoken } from "../../services/apiservice";


export interface ComponentLayoutApp {
    drawer:JSX.Element
    setDrawer:Dispatch<React.SetStateAction<JSX.Element>>
}

const AppLayout: React.FC =()=> {
  const [role,setrole] = useState<string>("")
  const [menuDrawer,setMenuDrawer] = useState<JSX.Element>(<MenuA />)
  const drawer = (
    <div>
      <Toolbar />
      {menuDrawer}
    </div>
  )

  const outlet = (
    <div>
      <Outlet />
    </div>
  )
  useEffect(() => {
    const item = localStorage.getItem("User");
    if (item && item !== "undefined") {
      const user = JSON.parse(item);
      Checktoken(user.token).then((response)=>{
        if (response.status === "ok") {
          setrole(response.data[0].role)
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
  console.log(role)
  return (
    <>
    {role === "admin" &&
    // <ContentHolder>
      <Box>
        <TestNavbar drawer={outlet}/>
          {/* <Navbar  drawer={menuDrawer} setDrawer={setMenuDrawer}/> */}
          {/* <Sidebar drawer={drawer} drawerWidth={220}/> */}
          {/* <TestSidebar drawer={testdrawer}/> */}
          {/* <Outlet/> */}
      </Box>
      // </ContentHolder>
      }
      {role === "user" &&
        <Box>
            <NavbarUser  drawer={menuDrawer} setDrawer={setMenuDrawer}/>
            <Outlet/>
        </Box>
      }
    </>
  );
}

export default AppLayout;
