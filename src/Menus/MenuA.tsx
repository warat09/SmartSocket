import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import DevicesTwoToneIcon from '@mui/icons-material/DevicesTwoTone';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import DashboardIcon from "@mui/icons-material/Dashboard";


export default function MenuA() {
  const location = useLocation();
  const path = location.pathname;
  return (
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
  );
}
