import Drawer from "@mui/material/Drawer";
import * as React from "react";

interface ComponentSidebar {
    // drawerWidth:number
    drawer:JSX.Element
}

const Sidebar = ({drawer}:ComponentSidebar) => {
    const [open, setOpen] = React.useState(false);
    return(
    //     <Drawer
    //     variant="permanent"
    //     sx={{
    //       display: { xs: "none", sm: "block" },
    //       "& .MuiDrawer-paper": {
    //         boxSizing: "border-box",
    //         width: drawerWidth
    //       } 
    //     }}
    //     open
    //   >
    //     {drawer}
    //   </Drawer>
    <Drawer variant="permanent">
        {drawer}
    </Drawer>
    )
}
export default Sidebar