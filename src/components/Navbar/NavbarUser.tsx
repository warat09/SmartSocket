import React, { Dispatch,useEffect, useState } from "react";
import {BrowserRouter as Router,Route, Routes,Link, useNavigate} from "react-router-dom";
import { Checktoken } from "../../services/apiservice";
import MenuA from '../../Menus/MenuA';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import Drawer from "@mui/material/Drawer";
import PowerTwoToneIcon from '@mui/icons-material/PowerTwoTone';
// import Link from '@mui/material/Link';
const settings = ["Profile", "Account", "Dashboard", "Logout"];
const drawerWidth = 200;

function ResponsiveAppBar(props:any) {
  const { window } = props;
  const navigate = useNavigate();
  const [name, setname] = React.useState("");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const thedrawer : JSX.Element = props.drawer
  const setThedrawer : Dispatch<React.SetStateAction<JSX.Element>> = props.setDrawer
  // const [thedrawer, setThedrawer] = useState(<MenuA />);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    const item = localStorage.getItem("User");
    if (item && item !== "undefined") {
      const user = JSON.parse(item);
      Checktoken(user.token).then((response) => {
        if (response.status === "ok") {
          setname(user.username);
        } else {
          localStorage.clear();
        }
      });
    } else {
      navigate("/login");
    }
  }, []);
  const drawer = (
    <div>
      <Toolbar />
      {thedrawer}
    </div>
  );
  const container =
  window !== undefined ? () => window().document.body : undefined;
  return (
    <Box sx={{ display: "flex",pb:12 }}>
        <AppBar
        position="fixed"
        sx={{
          bgcolor: "#192846",
          width: "100%",
          zIndex: "999998"
        }}
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters>
            {/* <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 4, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton> */}
              <PowerTwoToneIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                SmartSocket
              </Typography>

              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              </Box>
              <PowerTwoToneIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
              <Typography
                variant="h5"
                noWrap
                component="a"
                href=""
                sx={{
                  mr: 2,
                  display: { xs: "flex", md: "none" },
                  flexGrow: 1,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                SmartSocket
              </Typography>
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}/>

              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt="Remy Sharp"
                      src={"https://ui-avatars.com/api/?name=" + name}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
    </Box>
  );
  
}

export default ResponsiveAppBar;
