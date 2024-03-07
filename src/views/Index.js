
import Header from "components/Headers/Header.js";
import Snowfall from "react-snowfall";
import React, { useEffect, useState } from "react";
import Leaderboard from "views/Leaderboard.js";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useHistory } from "react-router-dom";
import TabPanel from '../components/TabPanel.js';
import PolarTheme from "../components/PolarTheme.js"; 

const Index = () => {
  const history = useHistory();
  const tabDict = ["leaderboard", "events"];
  const [containerDivHeight, setContainerDivHeight] = useState(`calc(100vh - 250px)`);
  const [tabIndex, setTabIndex] = useState(0);

  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }

  const handleChange = (event, newValue) => {
    history.push({ hash: tabDict[newValue] });
    setTabIndex(newValue);
  };

  return (
    <>
      <Header />
      <AppBar position="static">
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs"
        >
          <Tab label="Leaderboard" {...a11yProps(0)} />
          <Tab label="Events" {...a11yProps(1)} />  
        </Tabs>
      </AppBar>
        <div style={{ height: containerDivHeight, width: "100%", overflow: "auto" }}>
          <TabPanel value={tabIndex} index={0} dir={PolarTheme.direction}>
            <Leaderboard />
          </TabPanel>
          <TabPanel value={tabIndex} index={1} dir={PolarTheme.direction}>
          </TabPanel>
        </div>
      <Snowfall
        snowflakeCount={50}
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
        }}
      ></Snowfall>
    </>
  );
};

export default Index;
