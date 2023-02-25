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

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const Team = () => {
  const [loading, setLoading] = React.useState(true);

  const [teamInfo, setTeamInfo] = React.useState("");
  const [statDescription, setStatDescription] = useState([]);
  const [keys, setKeys] = useState([]);
  const [reportedStats, setReportedStats] = useState([]);

  const teamStatsCallback = async (data) => {
    setTeamInfo(data);
    return data;
  };

  const statDescriptionCallback = async (data) => {
    setStatDescription(data);
    const tempKeys = [];
    for (let i = 0; i < data.data.length; i++) {
      const stat = data.data[i];
      if (Array.from(stat.stat_key)[0] !== "_" ) {
        tempKeys.push({
          "key":stat.stat_key,
          "name":stat.display_name
      });
      }
      setKeys(tempKeys);
    }
    return data;
  };

  const updateData = (info, list) => {
    let tempValues = [];
    const temp = {
      "fieldName": "team",
      "fieldValue": teamInfo["key"]
    }
    tempValues.push(temp);
    for (const key of list) {
      for (const fieldName in info){
        if (fieldName === key.key) {
          const value = Math.round(info[fieldName]* 100) / 100;
          const temp = {
            "fieldName": key.name,
            "fieldValue": value
          }
          tempValues.push(temp)
        }
      }
    }
    setReportedStats(tempValues);
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const params = url.pathname.split("/");
    const year = params[3];
    const eventKey = params[4];
    const team = params[5];
    
    getStatDescription(year, eventKey, statDescriptionCallback);
    getTeamStatDescription(year, eventKey, team, teamStatsCallback);
    
  }, []);

  useEffect( async () => {
    await new Promise(r => setTimeout(r, 500));
    updateData(teamInfo,keys);
    setLoading(false);
  }, [teamInfo, keys]);

  return (
    <>
      { !loading &&
        Object.keys(reportedStats).map((e, i) => {
          const stat = reportedStats[i];
          return (
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <h3>
                {stat.fieldName} : {stat.fieldValue}
              </h3>
            </div>
          );
        })
      }
    </>
  );
};

export default Team;
