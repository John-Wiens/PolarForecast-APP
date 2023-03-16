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

import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Header from "components/Headers/Header.js";
import React, { useEffect, useState } from "react";
import { getStatDescription, getRankings, getMatchPredictions, getSearchKeys } from "api.js";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarExport,
  GridColDef,
  GridCellParams,
} from "@mui/x-data-grid";
import { useHistory } from "react-router-dom";
import Stack from "@mui/material/Stack";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import InfoIcon from "@mui/icons-material/Info";
import { IconButton } from "@mui/material";
import Snowfall from "react-snowfall";
import CircularProgress from "@mui/material/CircularProgress";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import "../assets/css/polar-css.css";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const Tables = () => {
  const history = useHistory();

  const [statDescription, setStatDescription] = useState([]);
  const [eventTitle, setEventTitle] = useState("");
  const [rankings, setRankings] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [showKeys, setShowKeys] = useState([]);
  const [statColumns, setStatColumns] = useState([]);
  const [matchPredictionColumns, setMatchPredictionColumns] = useState([
    {
      field: "match_number",
      headerName: "Match",
      filterable: false,
      disableExport: true,
      headerAlign: "center",
      align: "center",
      flex: 0.5,
    },
    {
      field: "blue_score",
      headerName: "Blue Score",
      filterable: false,
      disableExport: true,
      headerAlign: "center",
      align: "center",
      flex: 0.5,
      renderCell: (params) => {
        if (parseFloat(params.row.blue_score) > parseFloat(params.row.red_score)) {
          return (
            <Typography fontWeight="bold" color="primary">
              {" "}
              <EmojiEventsIcon /> {params.value}{" "}
            </Typography>
          );
        } else {
          return <Typography color="#FFFFFF"> {params.value}</Typography>;
        }
      },
    },
    {
      field: "red_score",
      headerName: "Red Score",
      filterable: false,
      disableExport: true,
      headerAlign: "center",
      align: "center",
      flex: 0.5,
      renderCell: (params) => {
        if (parseFloat(params.row.blue_score) < parseFloat(params.row.red_score)) {
          return (
            <Typography fontWeight="bold" color="#FF0000">
              <EmojiEventsIcon /> {params.value}
            </Typography>
          );
        } else {
          return <Typography color="#FFFFFF"> {params.value}</Typography>;
        }
      },
    },
    {
      field: "Info",
      headerName: "Info",
      sortable: false,
      headerAlign: "center",
      align: "center",
      flex: 0.5,
      minWidth: 70,
      renderCell: (params) => {
        const onClick = (e) => statisticsMatchOnClick(params.row);
        return (
          <IconButton onClick={onClick}>
            <InfoIcon />{" "}
          </IconButton>
        );
      },
    },
  ]);
  const [value, setValue] = React.useState(0);

  const statDescriptionCallback = async (data) => {
    const keys = [];
    const statColumns = [];

    statColumns.push({
      field: "id",
      headerName: "",
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.key) + 1,
      disableExport: true,
      GridColDef: "center",
      flex: 0.1,
    });

    statColumns.push({
      field: "key",
      headerName: "Team",
      filterable: false,
      headerAlign: "center",
      align: "center",
      minWidth: 75,
      flex: 0.5,
    });

    for (let i = 0; i < data.data.length; i++) {
      const stat = data.data[i];
      if (stat.report_stat) {
        keys.push(stat.stat_key);
        statColumns.push({
          field: stat.stat_key,
          headerName: stat.display_name,
          type: "number",
          sortable: true,
          headerAlign: "center",
          align: "center",
          minWidth: 70,
          flex: 0.5,
        });
      }
    }

    statColumns.push({
      field: "Info",
      headerName: "Info",
      sortable: false,
      headerAlign: "center",
      align: "center",
      flex: 0.5,
      minWidth: 70,
      renderCell: (params) => {
        const onClick = (e) => statisticsTeamOnClick(params.row);
        return (
          <IconButton onClick={onClick}>
            <InfoIcon />{" "}
          </IconButton>
        );
      },
    });

    setShowKeys(keys);
    setStatDescription(data.data);
    setStatColumns(statColumns);
  };

  const statisticsTeamOnClick = (cellValues) => {
    const url = new URL(window.location.href);
    const eventKey = url.pathname.split("/")[4];
    history.push(eventKey + "/team-" + cellValues.key);
  };

  const statisticsMatchOnClick = (cellValues) => {
    const url = new URL(window.location.href);
    const eventKey = url.pathname.split("/")[4];
    history.push(eventKey + "/match-" + cellValues.key);
  };

  const average = (array) => array.reduce((a, b) => a + b) / array.length;

  const rankingsCallback = async (data) => {
    data.data = data.data.filter((obj) => {
      if (obj.key) {
        return true;
      }
    });
    let oprList = [];

    for (const team of data?.data) {
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
    if (average(oprList) !== 0) {
      data.data.sort(function (a, b) {
        return a.OPR - b.OPR;
      });
      data.data.reverse();
    } else {
      data.data.sort(function (a, b) {
        return a.key - b.key;
      });
    }
    setRankings(data.data);
  };

  const predictionsCallback = async (data) => {
    const data_array = [];
    for (const match of data.data) {
      if (match.comp_level === "qm") {
        for (const [key, value] of Object.entries(match)) {
          if (typeof value === "number" && key.toLowerCase() !== "match_number") {
            match[key] = match[key]?.toFixed(1);
          }
        }
        data_array.push(match);
      }
    }
    data_array.sort(function (a, b) {
      return a.match_number - b.match_number;
    });
    setPredictions(data_array);
  };

  const searchKeysCallback = async (data) => {
    const url = new URL(window.location.href);
    const eventName = url.pathname.split("/")[3] + url.pathname.split("/")[4];

    for (let i = 0; i < data.data.length; i++) {
      if (data.data[i]?.key === eventName) {
        setEventTitle(data.data[i]?.display);
      }
    }
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const params = url.pathname.split("/");
    const year = params[3];
    const eventKey = params[4];

    getStatDescription(year, eventKey, statDescriptionCallback);
    getRankings(year, eventKey, rankingsCallback);
    getMatchPredictions(year, eventKey, predictionsCallback);
    getSearchKeys(searchKeysCallback);
  }, []);

  function customToolbar() {
    return (
      <div className="text-white mb-0">
        <GridToolbarContainer className="text-white mb-0">
          <GridToolbarColumnsButton />
          <GridToolbarExport />
        </GridToolbarContainer>
      </div>
    );
  }

  function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 210px)" }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Header />
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs"
        >
          <Tab label="Event Ranking" {...a11yProps(0)} />
          <Tab label="Match Prediction" {...a11yProps(1)} />
          {/* <Tab label="Polar Power" {...a11yProps(2)} /> */}
        </Tabs>
      </AppBar>
      <div style={{ height: "calc(100vh - 180px)", width: "100%", overflow: "auto" }}>
        <TabPanel value={value} index={0} dir={darkTheme.direction}>
          <ThemeProvider theme={darkTheme}>
            <Container>
              <Row>
                <Card className="bg-gradient-default shadow">
                  <CardHeader className="bg-transparent">
                    <h3 className="text-white mb-0">Event Rankings - {eventTitle}</h3>
                  </CardHeader>
                  <div style={{ height: "calc(100vh - 280px)", width: "100%" }}>
                    {rankings.length > 0 ? (
                      <DataGrid
                        disableColumnMenu
                        rows={rankings}
                        getRowId={(row) => {
                          return row.key;
                        }}
                        columns={statColumns}
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
                        components={[
                          { Toolbar: customToolbar },
                          {
                            NoRowsOverlay: () => (
                              <Stack height="100%" alignItems="center" justifyContent="center">
                                No Match Data
                              </Stack>
                            ),
                          },
                        ]}
                      />
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          minHeight: "calc(100vh - 300px)",
                        }}
                      >
                        <CircularProgress />
                      </Box>
                    )}
                  </div>
                </Card>
              </Row>
            </Container>
          </ThemeProvider>
        </TabPanel>
        <TabPanel value={value} index={1} dir={darkTheme.direction}>
          <ThemeProvider theme={darkTheme}>
            <Container>
              <Row>
                <div className="col">
                  <Card className="bg-gradient-default shadow">
                    <CardHeader className="bg-transparent">
                      <h3 className="text-white mb-0">Match Predictions - {eventTitle}</h3>
                    </CardHeader>
                    <div style={{ height: "calc(100vh - 280px)", width: "100%" }}>
                      <DataGrid
                        disableColumnMenu
                        rows={predictions}
                        getRowId={(row) => {
                          return row.key;
                        }}
                        columns={matchPredictionColumns}
                        pageSize={100}
                        rowsPerPageOptions={[100]}
                        disableExtendRowFullWidth={true}
                        sx={{
                          boxShadow: 2,
                          border: 0,
                          borderColor: "white",
                          "& .MuiDataGrid-cell:hover": {
                            color: "white",
                          },
                        }}
                        components={{
                          NoRowsOverlay: () => (
                            <Stack height="100%" alignItems="center" justifyContent="center">
                              No Match Data
                            </Stack>
                          ),
                        }}
                      />
                    </div>
                  </Card>
                </div>
              </Row>
            </Container>
          </ThemeProvider>
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

export default Tables;
