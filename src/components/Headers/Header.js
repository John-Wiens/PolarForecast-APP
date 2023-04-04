/*!

=========================================================
* Argon Dashboard React - v1.2.2
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import picture from "../../assets/img/brand/PolarbearHead.png";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { IconButton, useMediaQuery  } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Drawer from "@mui/material/Drawer";
import ResponsiveAppBar from "./Navbar";

import "../../assets/css/polar-css.css";

const Header = () => {
  

  return (
    <ResponsiveAppBar/>
  );
};

export default Header;
