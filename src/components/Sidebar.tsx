import Drawer from "@mui/material/Drawer";

interface ComponentSidebar {
    drawerWidth:number
    drawer:JSX.Element
}

const Sidebar = ({drawer,drawerWidth}:ComponentSidebar) => {
    return(
        <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth
          } 
        }}
        open
      >
        {drawer}
      </Drawer>
    )
}
export default Sidebar