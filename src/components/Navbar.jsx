import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { ThemeProvider } from "@mui/material/styles";
import { bulletsTheme } from "../assets/bulletsStyle";
import { useState } from "react";
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

const Navbar = ({ childBottom, childTop, subheaderTop, subheaderBottom }) => {
  const [drawerState, setDrawerState] = useState(false);
  const toggleDrawer = () => {
    setDrawerState(!drawerState);
  };

  return (
    <ThemeProvider theme={bulletsTheme}>
      <Box sx={{ flexGrow: 1 }} marginBottom={"3rem"}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Project Kr0-Check
            </Typography>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
      <Drawer anchor={"right"} open={drawerState} onClose={toggleDrawer}>
        <Box sx={{ width: 250 }} role="presentation">
          <Box position={"absolute"} left={"-2rem"}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <List subheader={subheaderTop}>{childTop}</List>
          <Divider />
          <List subheader={subheaderBottom}>{childBottom}</List>
        </Box>
      </Drawer>
    </ThemeProvider>
  );
};

export default Navbar;
