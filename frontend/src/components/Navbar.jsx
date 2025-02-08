import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  Box,
  IconButton,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)"); // Responsive breakpoint
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/");
  };

  // Check if token exists in sessionStorage
  const tokenExists = sessionStorage.getItem("token");

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "black" }}>
        <Toolbar>
          {/* Logo */}
          <Typography variant="h6" sx={{ flexGrow: 1, color: "white" }}>
            <Link
              to={tokenExists ? "/dashboard" : "/"} // Conditionally set the Link
              style={{ textDecoration: "none", color: "white" }}
            >
              EventManager
            </Link>
          </Typography>

          {/* Mobile View - Hamburger Menu */}
          {isMobile ? (
            <>
              <IconButton
                edge="end"
                color="inherit"
                onClick={() => setDrawerOpen(true)}
              >
                <FontAwesomeIcon icon={faBars} size="lg" />
              </IconButton>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
              >
                <List>
                  {isAuthenticated ? (
                    <>
                      <ListItem button component={Link} to="/create-event">
                        <ListItemText primary="Create Event" />
                      </ListItem>
                      <ListItem button onClick={handleLogout}>
                        <ListItemText primary="Logout" />
                      </ListItem>
                    </>
                  ) : (
                    <>
                      <ListItem button component={Link} to="/">
                        <ListItemText primary="Register" />
                      </ListItem>
                      <ListItem button component={Link} to="/login">
                        <ListItemText primary="Login" />
                      </ListItem>
                      <ListItem button component={Link} to="/guest">
                        <ListItemText primary="Guest" />
                      </ListItem>
                    </>
                  )}
                </List>
              </Drawer>
            </>
          ) : (
            /* Desktop View - Normal Buttons */
            <Box>
              {isAuthenticated ? (
                <>
                  <Link to="/create-event">
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ marginRight: "10px" }}
                    >
                      Create Event
                    </Button>
                  </Link>
                  <Button variant="contained" color="secondary" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/">
                    <Button sx={{ color: "white", marginRight: "10px" }}>Register</Button>
                  </Link>
                  <Link to="/login">
                    <Button sx={{ color: "white", marginRight: "10px" }}>Login</Button>
                  </Link>
                  <Link to="/guest">
                    <Button sx={{ color: "white" }}>Guest</Button>
                  </Link>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;