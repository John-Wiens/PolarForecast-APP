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
import React, { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import { useHistory } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";
import RefreshIcon from "@mui/icons-material/Refresh";
import "../../assets/css/polar-css.css";

const Header = () => {
  const history = useHistory();
  const [link, setLink] = useState("/data/index");

  useEffect(() => {
    const url = new URL(window.location.href);
    const params = url.pathname.split("/");
    if (params.length > 5) {
      const temp_link = "/" + params[1] + "/" + params[2] + "/" + params[3] + "/" + params[4];
      setLink(temp_link);
    } else {
      setLink("/data/index");
    }
  }, []);

  return (
    <>
      <div
        style={{
          background: "linear-gradient(87deg, #11cdef 0, #1171ef 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ThemeProvider theme={theme}>
          <Grid container spacing={3}>
            <Grid item xs>
            </Grid>
            <Grid item xs={6} style={{ textAlign: "center" }}>
              <Link to={link}>
                <img src={picture} alt={"logo"} />
              </Link>
            </Grid>
            <Grid item xs>
              {/* <IconButton
                style={{}}
                onClick={() => {
                  history.push("/data/index");
                  setLink("/data/index");
                }}
              >
                <HomeIcon className="svg_icons"/>
              </IconButton> */}
            </Grid>
          </Grid>
        </ThemeProvider>
      </div>
    </>
  );
};

const theme = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: "#000000",
    },
    secondary: {
      // This is green.A700 as hex.
      main: "#11cb5f",
    },
  },
});

export default Header;
