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
import Chart from "chart.js";

import { chartOptions, parseOptions } from "variables/charts.js";

import Search from "./Search.js";
import Header from "components/Headers/Header.js";
import Snowfall from "react-snowfall";

const Index = (props) => {
  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  return (
    <>
      <Header />

      <div style={{ height: "calc(100vh - 180px)", width: "100%" }}>
        <Snowfall
          snowflakeCount={50}
          style={{
            position: "fixed",
            width: "100vw",
            height: "100vh",
          }}
        ></Snowfall>
        <Search></Search>
      </div>
    </>
  );
};

export default Index;
