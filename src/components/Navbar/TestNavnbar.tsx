import React, { Dispatch,useEffect, useState } from "react";
import { Checktoken } from "../../services/apiservice";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import { Link, useLocation ,useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";

import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import DevicesTwoToneIcon from '@mui/icons-material/DevicesTwoTone';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import DashboardIcon from "@mui/icons-material/Dashboard";
import PowerTwoToneIcon from '@mui/icons-material/PowerTwoTone';


const drawerWidth = 240;


const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: "hidden"
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`
  }
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open"
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open"
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme)
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme)
  })
}));

export default function MiniDrawer(props:any) {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const thedrawer : any = props.drawer
  const [name, setname] = React.useState({username:"",name:"",email:""});

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    const item = localStorage.getItem("User");
    if (item && item !== "undefined") {
      const user = JSON.parse(item);
      Checktoken(user.token).then((response) => {
        if (response.status === "ok") {
          setname({username:user.username,name:response.data[0].name,email:response.data[0].email});
          console.log(response.data[0])
        } else {
          localStorage.clear();
        }
      });
    } else {
      navigate("/login");
    }
  }, []);
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar 
      position="fixed" 
      open={open}
      sx={{
        bgcolor: "#192846",
      }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" })
            }}
          >
            <MenuIcon />
          </IconButton>
          <PowerTwoToneIcon sx={{ display: { xs: "flex" }, mr: 1 }} />
          <Typography variant="h6" noWrap component="a" href="/" sx={{
                  mr: 2,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}>
            SmartSocket
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton sx={{ p: 0 }}>
            <Avatar
              alt="Remy Sharp"
              src={"https://ui-avatars.com/api/?name=" + name.name.slice(0, 1)}
            />
          </IconButton>
          {/* <Box sx={{ opacity: open ? 1 : 0 }}>
          <h6>{name.name}</h6>
          <h6>{name.email}</h6>
          </Box> */}
          <ListItemText primary={(
            <><h6>{name.name}</h6><h6>{name.email}</h6></>
          )} sx={{ opacity: open ? 1 : 0,pt: 2,pl:2}} />
          {/* <ListItemText primary={name.email} sx={{ opacity: open ? 1 : 0 }} /> */}
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
      <ListItem
        component={Link}
        to="/"
        button
        key={"1"}
        selected={"/" === path}
      >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary={"Dashboard"} />
      </ListItem>

      <ListItem
        component={Link}
        to="/node"
        button
        key={"2"}
        selected={"/node" === path}
      >
        <ListItemIcon>
          <ElectricalServicesIcon />
        </ListItemIcon>
        <ListItemText primary={"Node"} />
      </ListItem>

      <ListItem
        component={Link}
        to="/asset"
        button
        key={"3"}
        selected={"/asset" === path}
      >
        <ListItemIcon>
          <DevicesTwoToneIcon />
        </ListItemIcon>
        <ListItemText primary={"Asset"} />
      </ListItem>

      <ListItem
        component={Link}
        to="/match"
        button
        key={"4"}
        selected={"/match" === path}
      >
        <ListItemIcon>
          <AccountTreeIcon />
        </ListItemIcon>
        <ListItemText primary={"Match"} />
      </ListItem>

      <ListItem
        component={Link}
        to="/approve"
        button
        key={"5"}
        selected={"/approve" === path}
      >
        <ListItemIcon>
          <HowToRegIcon />
        </ListItemIcon>
        <ListItemText primary={"Approve"} />
      </ListItem>

      <ListItem
        component={Link}
        to="/usermatch"
        button
        key={"6"}
        selected={"/usermatch" === path}
      >
        <ListItemIcon>
          <PermContactCalendarIcon />
        </ListItemIcon>
        <ListItemText primary={"UserMatch"} />
      </ListItem>

      <ListItem
        component={Link}
        to="/transaction"
        button
        key={"7"}
        selected={"/transaction" === path}
      >
        <ListItemIcon>
          <ReceiptLongIcon />
        </ListItemIcon>
        <ListItemText primary={"Transaction"} />
      </ListItem>
    </List>
        {/* <List>
          {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center"
                  }}
                >
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List> */}


        {/* <Divider /> */}
        {/* <List>
          {["All mail", "Trash", "Spam"].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center"
                  }}
                >
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List> */}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {thedrawer}
      </Box>
    </Box>
  );
}
