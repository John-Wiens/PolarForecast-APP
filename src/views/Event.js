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
import { alpha, styled } from "@mui/material/styles";
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
  gridClasses,
} from "@mui/x-data-grid";
import { useHistory } from "react-router-dom";
import Stack from "@mui/material/Stack";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import InfoIcon from "@mui/icons-material/Info";
import { IconButton } from "@mui/material";
import Snowfall from "react-snowfall";
import CircularProgress from "@mui/material/CircularProgress";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import Link from '@mui/material/Link';
import "../assets/css/polar-css.css";

const Tables = () => {
  const history = useHistory();

  const [statDescription, setStatDescription] = useState([]);
  const [eventTitle, setEventTitle] = useState("");
  const [rankings, setRankings] = useState([]);
  const [qualPredictions, setQualPredictions] = useState([]);
  const [elimPredictions, setElimPredictions] = useState([]);
  const [showKeys, setShowKeys] = useState([]);
  const [statColumns, setStatColumns] = useState([]);
  const [matchPredictionColumns, setMatchPredictionColumns] = useState([
    {
      field: "match_number",
      headerName: "Match",
      sortable: false,
      disableExport: true,
      headerAlign: "center",
      align: "center",
      flex: 0.5,
      renderCell: (params) => {
        const onClick = (e) => statisticsMatchOnClick(params.row);
        return (
          <Link 
            component="button"
            onClick={onClick}
            underline="always">
            {params.value}
          </Link>
        );
      },
    },
    {
      field: "data_type",
      headerName: "Type",
      sortable: false,
      disableExport: true,
      headerAlign: "center",
      align: "center",
      flex: 0.5,
    },
    {
      field: "blue_score",
      headerName: "Blue",
      sortable: false,
      disableExport: true,
      headerAlign: "center",
      align: "center",
      flex: 0.5,
      renderCell: (params) => {
        let showTrophy = false;
        if ("blue_actual_score" in params.row){ showTrophy = true; }
        if (parseFloat(params.row.blue_score) > parseFloat(params.row.red_score)) {
          return (
            <Typography fontWeight="bold" color="primary">
              {showTrophy && <EmojiEventsIcon />} {params.value}
            </Typography>
          );
        } else {
          return <Typography color="#FFFFFF"> {params.value}</Typography>;
        }
      },
    },
    {
      field: "red_score",
      headerName: "Red",
      sortable: false,
      disableExport: true,
      headerAlign: "center",
      align: "center",
      flex: 0.5,
      renderCell: (params) => {
        let showTrophy = false;
        if ("red_actual_score" in params.row){ showTrophy = true; }
        if (parseFloat(params.row.blue_score) < parseFloat(params.row.red_score)) {
          return (
            <Typography fontWeight="bold" color="#FF0000">
              {showTrophy && <EmojiEventsIcon />} {params.value}
            </Typography>
          );
        } else {
          return <Typography color="#FFFFFF"> {params.value}</Typography>;
        }
      },
    }
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
      renderCell: (params) => {
        const onClick = (e) => statisticsTeamOnClick(params.row);
        return (
          <Link 
            component="button"
            onClick={onClick}
            underline="always">
            {params.value}
          </Link>
        );
      },
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
    setRankings(data.data);
  };

  const predictionsCallback = async (data) => {
    const quals_array = [];
    const sf_elims_array = [];
    const f_elims_array = [];
    for (const match of data.data) {
      if (match.comp_level === "qm") {
        for (const [key, value] of Object.entries(match)) {
          if (typeof value === "number" && key.toLowerCase() !== "match_number") {
            match[key] = match[key]?.toFixed(0);
          }
        }
        if ("blue_actual_score" in match) {
          match.data_type = "Actual";
          match.blue_score = match.blue_actual_score
          match.red_score = match.red_actual_score
        } else {
          match.data_type = "Predicted";
        }
        match.match_number = "QM-" + match.match_number
        quals_array.push(match);
      } else if (match.comp_level === "sf") {
        for (const [key, value] of Object.entries(match)) {
          if (typeof value === "number" && key.toLowerCase() !== "match_number") {
            match[key] = match[key]?.toFixed(1);
          }
        }
        if ("blue_actual_score" in match) {
          match.data_type = "Actual";
          match.blue_score = match.blue_actual_score
          match.red_score = match.red_actual_score
        } else {
          match.data_type = "Predicted";
        }
        match.match_key = Number(match.set_number).toFixed(0);
        match.match_number =
        match.comp_level.toUpperCase() + "-" + Number(match.set_number).toFixed(0);
        sf_elims_array.push(match);
      } else if (match.comp_level === "f") {
        for (const [key, value] of Object.entries(match)) {
          if (typeof value === "number" && key.toLowerCase() !== "match_number") {
            match[key] = match[key]?.toFixed(1);
          }
        }
        if ("blue_actual_score" in match) {
          match.data_type = "Result";
          match.blue_score = match.blue_actual_score
          match.red_score = match.red_actual_score
        } else {
          match.data_type = "Predicted";
        }
        match.match_key = match.match_number;
        match.match_number =
        match.comp_level.toUpperCase() + "-" + Number(match.match_number).toFixed(0);
        f_elims_array.push(match);
      }
    }
    sf_elims_array.sort(function (a, b) {
      return a.match_key - b.match_key;
    });

    f_elims_array.sort(function (a, b) {
      return a.match_key - b.match_key;
    });
    
    const elims_array = sf_elims_array.concat(f_elims_array);

    setQualPredictions(quals_array);
    setElimPredictions(elims_array);
  };

  const searchKeysCallback = async (data) => {
    const url = new URL(window.location.href);
    const eventName = url.pathname.split("/")[3] + url.pathname.split("/")[4];

    for (let i = 0; i < data.data.length; i++) {
      if (data.data[i]?.key === eventName) {
        setEventTitle(data.data[i]?.display.split("[")[0]);
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
          <Tab label="Rankings" {...a11yProps(0)} />
          <Tab label="Quals" {...a11yProps(1)} />
          {elimPredictions.length > 0 && <Tab label="Elims" {...a11yProps(2)} />}
          {/* <Tab label="Polar Power" {...a11yProps(2)} /> */}
        </Tabs>
      </AppBar>
      <div style={{ height: "calc(100vh - 180px)", width: "100%", overflow: "auto" }}>
        <TabPanel value={value} index={0} dir={darkTheme.direction}>
          <ThemeProvider theme={darkTheme}>
            <Container>
              <Row>
                <div style={{ height: "calc(100vh - 280px)", width: "100%" }}>
                  <Card className="bg-gradient-default shadow">
                    <CardHeader className="bg-transparent">
                      <h3 className="text-white mb-0">Event Rankings - {eventTitle}</h3>
                    </CardHeader>
                    <div style={{ height: "calc(100vh - 280px)", width: "100%" }}>
                      {rankings.length > 0 ? (
                        <StripedDataGrid
                          initialState={{
                            sorting: {
                              sortModel: [{ field: "OPR", sort: "desc" }],
                            },
                          }}
                          disableColumnMenu
                          rows={rankings}
                          getRowId={(row) => {
                            return row.key;
                          }}
                          columns={statColumns}
                          pageSize={100}
                          rowsPerPageOptions={[100]}
                          components={{
                            Toolbar: customToolbar,
                            NoRowsOverlay: () => (
                              <Stack height="100%" alignItems="center" justifyContent="center">
                                No Match Data
                              </Stack>
                            ),
                          }}
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
                            minHeight: "calc(100vh - 300px)",
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
          </ThemeProvider>
        </TabPanel>
        <TabPanel value={value} index={1} dir={darkTheme.direction}>
          <ThemeProvider theme={darkTheme}>
            <Container>
              <Row>
                <div style={{ height: "calc(100vh - 280px)", width: "100%" }}>
                  <Card className="bg-gradient-default shadow">
                    <CardHeader className="bg-transparent">
                      <h3 className="text-white mb-0">Qualifications Predictions - {eventTitle}</h3>
                    </CardHeader>
                    <div style={{ height: "calc(100vh - 280px)", width: "100%" }}>
                      <StripedDataGrid
                        initialState={{
                          sorting: {
                            sortModel: [{ field: "match_number", sort: "asc" }],
                          },
                        }}
                        disableColumnMenu
                        rows={qualPredictions}
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
                        getRowClassName={(params) =>
                          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
                        }
                      />
                    </div>
                  </Card>
                </div>
              </Row>
            </Container>
          </ThemeProvider>
        </TabPanel>
        <TabPanel value={value} index={2} dir={darkTheme.direction}>
          <ThemeProvider theme={darkTheme}>
            <Container>
              <Row>
                <div style={{ height: "calc(100vh - 280px)", width: "100%" }}>
                  <Card className="bg-gradient-default shadow">
                    <CardHeader className="bg-transparent">
                      <h3 className="text-white mb-0">Eliminations Predictions - {eventTitle}</h3>
                    </CardHeader>
                    <div style={{ height: "calc(100vh - 280px)", width: "100%" }}>
                      <StripedDataGrid
                        disableColumnMenu
                        rows={elimPredictions}
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
                        getRowClassName={(params) =>
                          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
                        }
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

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
    "&:hover, &.Mui-hovered": {
      backgroundColor: alpha("#78829c", ODD_OPACITY),
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
    "&.Mui-selected": {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity
      ),
      "&:hover, &.Mui-hovered": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY + theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  },
}));

export default Tables;
