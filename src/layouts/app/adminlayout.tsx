import {Dispatch,SetStateAction,useState,useEffect,FC, ReactNode} from 'react';
import { Outlet , useNavigate} from 'react-router-dom';
import TestSidebar from '../../components/Siderbar/TestSidebar'
import Navbar from '../../components/Navbar/Navbar'
import NavbarUser from '../../components/Navbar/NavbarUser'
import MenuA from '../../Menus/MenuA';
import ContentHolder from "./contentholder";
import Nav from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Siderbar/NewSidebar';
import { styled } from '@mui/material/styles';
import { Checktoken } from "../../services/apiservice";
import { Box, alpha, lighten, useTheme } from '@mui/material';



export interface ComponentLayoutApp {
    drawer:JSX.Element
    setDrawer:Dispatch<React.SetStateAction<JSX.Element>>
}
interface SidebarLayoutProps {
  children?: ReactNode;
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
const AppLayout:FC<SidebarLayoutProps>=() => {

  const theme = useTheme();

  const navigate = useNavigate();

  const [userData,setUserData] = useState<string>("");
  
  const [open, setOpen] = useState(false);

  useEffect(() => {
    console.log("adminlayout")
    const item = localStorage.getItem("User");
    if (item && item !== "undefined") {
      const user = JSON.parse(item);
      Checktoken("/User/CheckToken",user.token).then((response) => {
        if (response.status === "ok") {
          if(response.data.role === "admin"){
            setUserData(response.data)
          }
        }else{
          navigate('/login')
        } 
      });
    }
    else{
      navigate('/login')
    } 
  }, []);

  return (
    <StyledRoot>
        <Nav UserData={userData} onOpenNav={() => setOpen(true)} />
        <Sidebar UserData={userData} openNav={open} onCloseNav={() => setOpen(false)} />
        <Main>
          <Outlet />
        </Main>
    </StyledRoot>
  );
}

export default AppLayout;
