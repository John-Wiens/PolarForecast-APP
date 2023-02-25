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
// reactstrap components

// core components
import Header from "components/Headers/Header.js";
import React, { useEffect, useState } from "react";
import { getStatDescription, getTeamStatDescription } from "api.js";
import { createTheme } from "@mui/material/styles";
import Team from "./Team.js"
import Match from "./Match.js"

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const Selector = () => {
  const [type, setType] = React.useState("");


  useEffect(() => {
    const url = new URL(window.location.href);
    const params = url.pathname.split("/");
    if (params[5].substring(0,3) === "frc"){
      setType("team");
    } else {
      setType("match");
    }


  }, []);

  return (
    <>
      <Header />

      { type === 'team' &&
        <Team/>
      }
      { type === 'match' &&
        <Match/>
      }
    </>
  );
};

export default Selector;
