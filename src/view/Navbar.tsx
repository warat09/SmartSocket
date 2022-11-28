// import * as React from "react";
// import { NavLink } from "react-router-dom";

// function NavList() {
//   // This styling will be applied to a <NavLink> when the
//   // route that it links to is currently selected.
//   let activeStyle = {
//     textDecoration: "underline",
//   };

//   let activeClassName = "underline";

//   return (
//     <nav>
//       <ul>
//         <li>
//           <NavLink
//             to=".."
//             style={({ isActive }) =>
//               isActive ? activeStyle : undefined
//             }
//           >
//             dashboard
//           </NavLink>
//         </li>
//         <li>
//           <NavLink
//             to="node"
//             className={({ isActive }) =>
//               isActive ? activeClassName : undefined
//             }
//           >
//             node
//           </NavLink>
//         </li>
//         <li>
//           <NavLink
//             to="asset"
//             className={({ isActive }) =>
//               isActive ? activeClassName : undefined
//             }
//           >
//             asset
//           </NavLink>
//         </li>

//         <li>
//           <NavLink
//             to="match"
//             style={({ isActive }) =>
//               isActive ? activeStyle : undefined
//             }
//           >
//             match
//           </NavLink>
//         </li>

//         <li>
//           <NavLink
//             to="usermatch"
//             style={({ isActive }) =>
//               isActive ? activeStyle : undefined
//             }
//           >
//             usermatch
//           </NavLink>
//         </li>

//         <li>
//           <NavLink
//             to="transection"
//             className={({ isActive }) =>
//               isActive ? activeClassName : undefined
//             }
//           >
//             transection
//           </NavLink>
//         </li>
//       </ul>
//     </nav>
//   );
// }
// export default NavList

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Checktoken } from "../services/apiservice";
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
// import Link from '@mui/material/Link';

const pages = [
  { text: "node", href: "/Node" },
  { text: "assets", href: "/asset" },
  { text: "match", href: "/match" },
  { text: "usermatch", href: "/usermatch" },
  { text: "transaction", href: "/transaction" },
];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

function ResponsiveAppBar() {
  const navigate = useNavigate();
  const [name, setname] = React.useState("");
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleRedirect = (event: any) => {
    navigate(event.target.value); //if you go to the jsx part, you can  see that i added a button to `{page}` and added a value to the button to be the page itself
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
      Checktoken(user.token).then((status) => {
        if (status === true) {
          setname(user.username);
        } else {
          localStorage.clear();
        }
      });
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
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
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.href} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">
                    <Link
                      to={page.href}
                      style={{ textDecoration: "none", color: "white" }}
                    >
                      {page.text}
                    </Link>
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
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
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.href}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                <Link
                  to={page.href}
                  style={{ textDecoration: "none", color: "white" }}
                >
                  {page.text}
                </Link>
              </Button>
            ))}
          </Box>

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
  );
}
export default ResponsiveAppBar;
