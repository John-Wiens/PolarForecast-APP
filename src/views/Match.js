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
import { Card, CardHeader, Container, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { alpha, styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { getMatchDetails, getStatDescription } from "api.js";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import CircularProgress from "@mui/material/CircularProgress";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import Box from "@mui/material/Box";
import "../assets/css/polar-css.css";
import { IconButton } from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import StripedDataGrid from '../components/StripedDataGrid.js';
import PolarTheme from "../components/PolarTheme.js"; 

const Match = () => {
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [matchTitle, setMatchTitle] = useState(false);
  const [matchNumber, setMatchNumber] = useState();
  const [bluePrediction, setBluePrediction] = useState(false);
  const [blueResult, setBlueResult] = useState(false);
  const [redPrediction, setRedPrediction] = useState(false);
  const [redResult, setRedResult] = useState(false);
  const [redTitle, setRedTitle] = useState(false);
  const [blueRows, setBlueRows] = useState([]);
  const [redRows, setRedRows] = useState([]);
  const [blueWinner, setBlueWinner] = useState(false);
  const [redWinner, setRedWinner] = useState(false);
  const [showKeys, setShowKeys] = useState([]);
  const [statColumns, setStatColumns] = useState([]);

  const statisticsTeamOnClick = (cellValues) => {
    history.push("team-" + cellValues.key);
  };

  const filterData = (data) => {
    data = data.filter((obj) => {
      if (obj.key) {
        return true;
      }
    });
    let oprList = [];

    for (const team of data) {
      if (team.key) {
        team.key = team.key.replace("frc", "");
      }
      oprList.push(team.OPR);
      for (const [key, value] of Object.entries(team)) {
        if (
          typeof value === "number" &&
          key.toLowerCase() !== "rank" &&
          key !== "expectedRanking" &&
          key.toLowerCase() !== "schedule"
        ) {
          team[key] = team[key]?.toFixed(1);
        } else {
          team[key] = Number(team[key]);
        }
      }
    }
    const sortedData = [...data].sort((a, b) => Number(b.OPR) - Number(a.OPR));
    console.debug(sortedData);
    return sortedData;
  };

  const matchInfoCallback = async (restData) => {
    setData(restData);
    console.debug(restData);

    setBlueRows(filterData(restData?.blue_teams));
    setRedRows(filterData(restData?.red_teams));

    if (restData?.match.winning_alliance === "red") {
      setRedWinner(true);
    } else if (restData?.match.winning_alliance === "blue") {
      setBlueWinner(true);
    }

    let date = new Date();
    if (restData?.match["actual_time"]) {
      date = new Date(restData?.match.actual_time * 1000);
      setBlueResult(`${Math.round(restData?.match.score_breakdown.blue.totalPoints)} Points,  
      ${Math.round(restData?.match.score_breakdown.blue.rp)} RPs`);
      setRedResult(`${Math.round(restData?.match.score_breakdown.red.totalPoints)} Points,  
      ${Math.round(restData?.match.score_breakdown.red.rp)} RPs`);
    } else {
      date = new Date(restData?.match.predicted_time * 1000);
    }
    const timeOfDay = date.toLocaleTimeString([], { hour: "numeric", minute: "numeric" });
    setMatchTitle(`#${restData?.prediction?.match_number} - ${timeOfDay}`);
    setBluePrediction(`${Math.round(restData?.prediction?.blue_score)} Points,  
      ${Math.round(restData?.prediction?.blue_win_rp)} RPs`);
    setRedPrediction(`${Math.round(restData?.prediction?.red_score)} Points,  
      ${Math.round(restData?.prediction?.red_win_rp)} RPs`);
    setRedTitle(
      ": " +
        String(Math.round(restData?.prediction?.red_score)) +
        " Points, " +
        String(Math.round(restData?.prediction?.red_win_rp)) +
        " RPs"
    );

    setLoading(false);
  };

  const statDescriptionCallback = async (data) => {
    // Main event table
    const keys = [];
    const statColumns = [];

    statColumns.push({
      field: "key",
      headerName: "Team",
      filterable: false,
      headerAlign: "center",
      align: "center",
      minWidth: 80,
      flex: 0.5,
      renderCell: (params) => {
        const onClick = (e) => statisticsTeamOnClick(params.row);
        return (
          <Link component="button" onClick={onClick} underline="always">
            {params.value}
          </Link>
        );
      },
    });

    const mainColumnData = data.data.filter(item => item.report_stat);
    
    mainColumnData.sort((a, b) => a.order - b.order);
    console.debug(mainColumnData)

    for (let i = 0; i < mainColumnData.length; i++) {
      const stat = mainColumnData[i];
      keys.push(stat.stat_key);
      statColumns.push({
        field: stat.stat_key,
        headerName: stat.display_name,
        type: "number",
        sortable: true,
        headerAlign: "center",
        align: "center",
        minWidth: 80,
        flex: 0.5,
      });
    }

    setShowKeys(keys);
    setStatColumns(statColumns);
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const params = url.pathname.split("/");
    const year = params[3];
    const eventKey = params[4];
    const match = params[5].split("-")[1];
    setMatchNumber(match);

    getStatDescription(year, eventKey, statDescriptionCallback);
    getMatchDetails(year, eventKey, match, matchInfoCallback);
  }, []);

  return (
    <>
      <ThemeProvider theme={PolarTheme}>
        <div style={{ height: "calc(100vh - 132px)", width: "100%", overflow: "auto" }}>
          <Container>
            <Row>
              <div style={{ width: "100%" }}>
                <Card className="polar-box">
                  <CardHeader className="bg-transparent" style={{ textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center" }}>
                      {/* {matchNumber.split("_").length } */}
                      {/* <IconButton>
                        <ArrowLeftIcon />
                      </IconButton> */}
                      <h1 className="text-white mb-0">Match {matchTitle}</h1>
                      {/* <IconButton>
                        <ArrowRightIcon 
                          onClick={rightOnClick}
                        />
                      </IconButton> */}
                  </CardHeader>
                </Card>
              </div>
            </Row>

            <Row>
              <div style={{ width: "100%" }}>
                <Card className="polar-box">
                  <CardHeader className="bg-transparent">
                    <h3 style={{ color: "#90caf9" }}>
                      {blueWinner && <EmojiEventsIcon />}Blue Alliance
                    </h3>
                    <h4 className="text-white mb-0">Prediction: {bluePrediction}</h4>
                    {blueResult && <h4 className="text-white mb-0">Result: {blueResult}</h4>}
                  </CardHeader>
                  <div style={{ height: "200px", width: "100%" }}>
                    {blueRows.length > 0 ? (
                      <StripedDataGrid
                        disableColumnMenu
                        rows={blueRows}
                        getRowId={(row) => {
                          return row.key;
                        }}
                        columns={statColumns}
                        hideFooter
                        pageSize={100}
                        rowsPerPageOptions={[100]}
                        rowHeight={30}
                        options={{ pagination: false }}
                        sx={{
                          mx: 0.5,
                          border: 0,
                          borderColor: "white",
                          "& .MuiDataGrid-cell:hover": {
                            color: "white",
                          },
                        }}
                        getRowClassName={(params) =>
                          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
                        }
                      />
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          minHeight: "320px",
                        }}
                      >
                        <CircularProgress />
                      </Box>
                    )}
                  </div>
                </Card>
                <Card className="polar-box">
                  <CardHeader className="bg-transparent">
                    <h3 style={{ color: "#FF0000" }}>
                      {redWinner && <EmojiEventsIcon />}Red Alliance
                    </h3>
                    <h4 className="text-white mb-0">Prediction: {redPrediction}</h4>
                    {redResult && <h4 className="text-white mb-0">Result: {redResult}</h4>}
                  </CardHeader>
                  <div style={{ height: "200px", width: "100%" }}>
                    {redRows.length > 0 ? (
                      <StripedDataGrid
                        disableColumnMenu
                        rows={redRows}
                        getRowId={(row) => {
                          return row.key;
                        }}
                        columns={statColumns}
                        pageSize={100}
                        rowsPerPageOptions={[100]}
                        rowHeight={30}
                        hideFooter
                        sx={{
                          mx: 0.5,
                          border: 0,
                          borderColor: "white",
                          "& .MuiDataGrid-cell:hover": {
                            color: "white",
                          },
                        }}
                        getRowClassName={(params) =>
                          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
                        }
                      />
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          minHeight: "320px",
                        }}
                      >
                        <CircularProgress />
                      </Box>
                    )}
                  </div>
                </Card>
              </div>
            </Row>
          </Container>
        </div>
      </ThemeProvider>
    </>
  );
};

export default Match;
