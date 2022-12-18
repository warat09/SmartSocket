import {Dispatch,SetStateAction,useState} from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../Navbar'
import MenuA from '../../Menus/MenuA';
import ContentHolder from "../../view/layouts/contentholder";
import {
  Box,
  Toolbar
} from "@mui/material";

export interface ComponentLayoutApp {
    drawer:JSX.Element
    setDrawer:Dispatch<React.SetStateAction<JSX.Element>>
}

const AppLayout: React.FC =()=> {
  const [menuDrawer,setMenuDrawer] = useState<JSX.Element>(<MenuA />)
  const drawer = (
    <div>
      <Toolbar />
      {menuDrawer}
    </div>
  )
  return (
    <>
    <ContentHolder>
      <Box>
          <Navbar  drawer={menuDrawer} setDrawer={setMenuDrawer}/>
          <Sidebar drawer={drawer} drawerWidth={220}/>
          <Outlet/>
      </Box>
      </ContentHolder>
    </>
  );
}

export default AppLayout;
