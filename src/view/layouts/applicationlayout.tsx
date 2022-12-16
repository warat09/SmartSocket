import {Dispatch,SetStateAction,useState} from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../Navbar'
import MenuA from '../../Menus/MenuA';
import Toolbar from "@mui/material/Toolbar";
import {
  Box,
  Grid
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
      <Box>
        <Grid container spacing={2}>
        <Grid item xs={6} md={12}>
          <Navbar  drawer={menuDrawer} setDrawer={setMenuDrawer}/>
        </Grid>
        <Grid xs={6} md={2}>
          <Sidebar drawer={drawer} drawerWidth={220}/>
        </Grid>
        <Grid  xs={6} md={10}>
          <Outlet/>
        </Grid>

        </Grid>
      </Box>
    </>
  );
}

export default AppLayout;
