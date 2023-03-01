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
import { Card, CardHeader, Container, Row } from "reactstrap";

// core components
import Header from "components/Headers/Header.js";
import React, { useEffect, useState } from "react";
import { getMatchDetails } from "api.js";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const generateColumns = (fieldName, headerName) => {
  const tempColumns = [];
  const length = fieldName.length;
  for (let i = 0; i < length; i++) {
    let newColumn = {
      field: "",
      headerName: "",
      filterable: false,
      disableExport: true,
      sortable: false,
      headerAlign: "center",
      align: "center",
      flex: 0.5,
      key: i + 1,
    };
    if (i === 0) {
      const obj = { ...newColumn };
      obj.headerName = "Team";
      obj.field = "team";
      obj.key = i;
      tempColumns.push(obj);
    }
    newColumn.headerName = headerName[i];
    newColumn.field = fieldName[i];
    tempColumns.push(newColumn);
  }

  return tempColumns;
};

const Match = () => {
  const [tableColumns, setTableColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState([]);

  const [columns, setColumns] = useState([]);
  const [blueRows, setBlueRows] = useState([]);
  const [redRows, setRedRows] = useState([]);
  const [blueWinner, setBlueWinner] = useState(false);
  const [redWinner, setRedWinner] = useState(false);

  const matchInfoCallback = async (restData) => {
    setData(restData);
    let newRow = {};

    const blueAutoRows = [];
    let i = 0;
    let blueAutoScore = 0;
    let blueChargeStation = 0;
    let blueTeleop = 0;
    for (const team of restData?.blue_teams) {
      newRow = {
        key: i,
        team: team.key.replace("frc", ""),
        auto_score: team.autoPoints.toFixed(1),
        auto_charge_station: team.autoChargeStation.toFixed(1),
        teleop_score: team.teleopPoints.toFixed(1),
        end_game: team.endgamePoints.toFixed(1),
      };
      blueAutoRows.push(newRow);
      i = i + 1;
      blueAutoScore = blueAutoScore + team.autoPoints;
      blueChargeStation = blueChargeStation + team.autoChargeStation;
      blueTeleop = blueTeleop + team.teleopPoints;
    }
    newRow = {
      key: 4,
      team: "Alliance",
      auto_score: blueAutoScore?.toFixed(1),
      auto_charge_station: blueChargeStation?.toFixed(1),
      teleop_score: blueTeleop?.toFixed(1),
      end_game: restData?.prediction.blue_endGame?.toFixed(1),
    };
    blueAutoRows.push(newRow);

    setBlueRows(blueAutoRows);

    const redAutoRows = [];
    i = 0;
    let redAutoScore = 0;
    let redChargeStation = 0;
    let redTeleop = 0;
    for (const team of restData?.red_teams) {
      newRow = {
        key: i,
        team: team.key.replace("frc", ""),
        auto_score: team.autoPoints.toFixed(1),
        auto_charge_station: team.autoChargeStation.toFixed(1),
        teleop_score: team.teleopPoints.toFixed(1),
        end_game: team.endgamePoints.toFixed(1),
      };
      redAutoRows.push(newRow);
      i = i + 1;
      redAutoScore = redAutoScore + team.autoPoints;
      redChargeStation = redChargeStation + team.autoChargeStation;
      redTeleop = redTeleop + team.teleopPoints;
    }
    newRow = {
      key: 4,
      team: "Alliance",
      auto_score: redAutoScore?.toFixed(1),
      auto_charge_station: redChargeStation?.toFixed(1),
      teleop_score: redTeleop?.toFixed(1),
      end_game: restData?.prediction.red_endGame?.toFixed(1),
    };
    redAutoRows.push(newRow);
    setRedRows(redAutoRows);

    if (restData?.match.winning_alliance === "red") {
      setRedWinner(true);
    } else if (restData?.match.winning_alliance === "blue") {
      setBlueWinner(true);
    }

    setLoading(false);
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const params = url.pathname.split("/");
    const year = params[3];
    const eventKey = params[4];
    const match = params[5].split("-")[1];
    setColumns(
      generateColumns(
        ["auto_score", "auto_charge_station", "teleop_score", "end_game"],
        ["Auto Score", "Charge Station", "Teleop Score", "End Game"]
      )
    );
    getMatchDetails(year, eventKey, match, matchInfoCallback);
  }, []);

  return (
    <>
      {!loading && (
        <ThemeProvider theme={darkTheme}>
          <div style={{ height: "calc(100vh + 25px)", width: "100%" }}>
            <Container>
              <Row>
                <div style={{ width: "100%" }}>
                  <Card className="bg-gradient-default shadow">
                    <CardHeader className="bg-transparent">
                      <h1 className="text-white mb-0">Match {data.prediction.match_number}</h1>
                      <h3 className="text-white mb-0">
                        BLUE {Math.round(data.prediction.blue_score)} POINTS - RED{" "}
                        {Math.round(data.prediction.red_score)} POINTS
                      </h3>
                    </CardHeader>
                  </Card>
                </div>
              </Row>

              <Row>
                <div style={{ width: "100%" }}>
                  <Card className="bg-gradient-default shadow">
                    <CardHeader className="bg-transparent">
                      <h3 className="text-white mb-0">Blue Alliance {blueWinner && " - Winner"}</h3>
                    </CardHeader>
                    <div style={{ height: "320px", width: "100%" }}>
                      <DataGrid
                        disableColumnMenu
                        rows={blueRows}
                        getRowId={(row) => {
                          return row.key;
                        }}
                        columns={columns}
                        pageSize={100}
                        rowsPerPageOptions={[100]}
                        sx={{
                          mx: 0.5,
                          border: 0,
                          borderColor: "white",
                          "& .MuiDataGrid-cell:hover": {
                            color: "white",
                          },
                        }}
                      />
                    </div>
                  </Card>
                  <Card className="bg-gradient-default shadow">
                    <CardHeader className="bg-transparent">
                      <h3 className="text-white mb-0">Red Alliance {redWinner && " - Winner"}</h3>
                    </CardHeader>
                    <div style={{ height: "320px", width: "100%" }}>
                      <DataGrid
                        disableColumnMenu
                        rows={redRows}
                        getRowId={(row) => {
                          return row.key;
                        }}
                        columns={columns}
                        pageSize={100}
                        rowsPerPageOptions={[100]}
                        sx={{
                          mx: 0.5,
                          border: 0,
                          borderColor: "white",
                          "& .MuiDataGrid-cell:hover": {
                            color: "white",
                          },
                        }}
                      />
                    </div>
                  </Card>
                </div>
              </Row>
            </Container>
          </div>
        </ThemeProvider>
      )}
    </>
  );
};

export default Match;
