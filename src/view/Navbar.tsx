import * as React from "react";
import { NavLink } from "react-router-dom";

function NavList() {
  // This styling will be applied to a <NavLink> when the
  // route that it links to is currently selected.
  let activeStyle = {
    textDecoration: "underline",
  };

  let activeClassName = "underline";

  return (
    <nav>
      <ul>
        <li>
          <NavLink
            to=".."
            style={({ isActive }) =>
              isActive ? activeStyle : undefined
            }
          >
            dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="node"
            className={({ isActive }) =>
              isActive ? activeClassName : undefined
            }
          >
            node
          </NavLink>
        </li>
        <li>
          <NavLink
            to="asset"
            className={({ isActive }) =>
              isActive ? activeClassName : undefined
            }
          >
            asset
          </NavLink>
        </li>

        <li>
          <NavLink
            to="match"
            style={({ isActive }) =>
              isActive ? activeStyle : undefined
            }
          >
            match
          </NavLink>
        </li>

        <li>
          <NavLink
            to="usermatch"
            style={({ isActive }) =>
              isActive ? activeStyle : undefined
            }
          >
            usermatch
          </NavLink>
        </li>
        
        <li>
          <NavLink
            to="transection"
            className={({ isActive }) =>
              isActive ? activeClassName : undefined
            }
          >
            transection
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
export default NavList
