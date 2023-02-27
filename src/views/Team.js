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
import React, { useEffect, useState } from "react";
import { getStatDescription, getTeamStatDescription } from "api.js";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";

const theme = createTheme({
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
      if (Array.from(stat.stat_key)[0] !== "_") {
        tempKeys.push({
          key: stat.stat_key,
          name: stat.display_name,
        });
      }
      setKeys(tempKeys);
    }
    return data;
  };

  const updateData = (info, list) => {
    let tempValues = [];
    list.sort(function (a, b) {
      a = a.name.toLowerCase();
      b = b.name.toLowerCase();

      return a < b ? -1 : a > b ? 1 : 0;
    });
    const temp = {
      fieldName: "team number",
      fieldValue: teamInfo["key"].replace("frc", ""),
    };
    tempValues.push(temp);
    for (const key of list) {
      for (const fieldName in info) {
        if (fieldName === key.key) {
          const value = Math.round(info[fieldName] * 100) / 100;
          const temp = {
            fieldName: key.name,
            fieldValue: value,
          };
          tempValues.push(temp);
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
    const team = params[5].replace("team-", "frc");

    getStatDescription(year, eventKey, statDescriptionCallback);
    getTeamStatDescription(year, eventKey, team, teamStatsCallback);
  }, []);

  useEffect(async () => {
    await new Promise((r) => setTimeout(r, 100));
    updateData(teamInfo, keys);
    setLoading(false);
  }, [teamInfo, keys]);

  return (
    <>
      {!loading &&
        Object.keys(reportedStats).map((e, i) => {
          const stat = reportedStats[i];
          return (
            <ThemeProvider theme={theme}>
              <Box
                sx={{
                  bgcolor: "#429BEF",
                  boxShadow: 1,
                  borderRadius: 2.5,
                  display: "inline-flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  p: 1,
                  m: 0.5,
                  width: "48%",
                }}
              >
                <Box sx={{ color: "text.secondary", width: "100%" }}>
                  {stat.fieldName.toUpperCase()}
                </Box>
                <Box
                  sx={{ color: "text.primary", width: "100%", fontSize: 25, fontWeight: "medium" }}
                >
                  {stat.fieldValue}
                </Box>
              </Box>
            </ThemeProvider>
          );
        })}
    </>
  );
};

export default Team;
