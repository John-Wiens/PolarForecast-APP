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
import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import { getStatDescription, getTeamStatDescription, getTeamMatchPredictions } from "api.js";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import InfoIcon from "@mui/icons-material/Info";
import { IconButton } from "@mui/material";
import { useHistory } from "react-router-dom";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import MoodBadIcon from "@mui/icons-material/MoodBad";
import { DataGrid, gridClasses } from "@mui/x-data-grid";

const Team = () => {
  const history = useHistory();

  const [loading, setLoading] = React.useState(true);

  const [teamInfo, setTeamInfo] = React.useState("");
  const [statDescription, setStatDescription] = useState([]);
  const [keys, setKeys] = useState([]);
  const [reportedStats, setReportedStats] = useState([]);
  const [value, setValue] = React.useState(0);
  const [teamNumber, setTeamNumber] = useState();

  const [columns, setColumns] = useState([
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
      field: "alliance_color",
      headerName: "Color",
      filterable: false,
      disableExport: true,
      headerAlign: "center",
      align: "center",
      flex: 0.5,
      renderCell: (params) => {
        if (params.value.toLowerCase() === "red") {
          return (
            <Typography fontWeight="bold" color="#FF0000">
              {params.value}
            </Typography>
          );
        } else {
          return (
            <Typography fontWeight="bold" color="primary">
              {params.value}
            </Typography>
          );
        }
      },
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
          if (params.row.alliance_color.toLowerCase() === "blue") {
            return (
              <Typography fontWeight="bold" color="primary">
                <EmojiEventsIcon /> {params.value}
              </Typography>
            );
          } else {
            return (
              <Typography fontWeight="bold" color="primary">
                {" "}
                <MoodBadIcon /> {params.value}{" "}
              </Typography>
            );
          }
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
          if (params.row.alliance_color.toLowerCase() === "red") {
            return (
              <Typography fontWeight="bold" color="#FF0000">
                <EmojiEventsIcon /> {params.value}
              </Typography>
            );
          } else {
            return (
              <Typography fontWeight="bold" color="#FF0000">
                {" "}
                <MoodBadIcon /> {params.value}{" "}
              </Typography>
            );
          }
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
  const [matchesRows, setMatchesRows] = useState([]);

  const statisticsMatchOnClick = (cellValues) => {
    history.push("match-" + cellValues.key);
  };

  const teamPredictionsCallback = async (data) => {
    const rows = [];
    const url = new URL(window.location.href);
    const params = url.pathname.split("/");
    const team = params[5].replace("team-", "frc");
    for (let i = 0; i < data.data.length; i++) {
      if (data.data[i].comp_level === "qm") {
        let color = "UNKOWN";
        if (data.data[i].blue_teams.find((obj) => obj === team)) {
          color = "Blue";
        } else if (data.data[i].red_teams.find((obj) => obj === team)) {
          color = "Red";
        }
        rows.push({
          key: data.data[i].key,
          match_number: data.data[i].match_number,
          alliance_color: color,
          blue_score: data.data[i].blue_score.toFixed(1),
          red_score: data.data[i].red_score.toFixed(1),
        });
      }
    }
    setMatchesRows(rows);
    setLoading(false);
  };

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
      fieldValue: teamInfo["key"]?.replace("frc", ""),
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
    const team = params[5].replace("team-", "");
    setTeamNumber(team);

    getTeamMatchPredictions(year, eventKey, "frc" + team, teamPredictionsCallback);

    getStatDescription(year, eventKey, statDescriptionCallback);
    getTeamStatDescription(year, eventKey, "frc" + team, teamStatsCallback);
  }, []);

  useEffect(async () => {
    await new Promise((r) => setTimeout(r, 100));
    updateData(teamInfo, keys);
  }, [teamInfo, keys]);

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
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs"
        >
          <Tab label="Schedule" {...a11yProps(0)} />
          <Tab label="Team Stats" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} dir={darkTheme.direction}>
        <div style={{ height: "calc(100vh - 180px)", width: "100%", overflow: "auto" }}>
          <ThemeProvider theme={darkTheme}>
            <Container>
              <Row>
                <div style={{ height: "calc(100vh - 290px)", width: "100%" }}>
                  <Card className="bg-gradient-default shadow">
                    <CardHeader className="bg-transparent">
                      <h3 className="text-white mb-0">Team {teamNumber} Schedule</h3>
                    </CardHeader>
                    <div style={{ height: "calc(100vh - 290px)", width: "100%" }}>
                      {!loading ? (
                        <StripedDataGrid
                          initialState={{
                            sorting: {
                              sortModel: [{ field: "match_number", sort: "asc" }],
                            },
                          }}
                          disableColumnMenu
                          rows={matchesRows}
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
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: "calc(100vh - 290px)",
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
        </div>
      </TabPanel>
      <TabPanel value={value} index={1} dir={darkTheme.direction}>
        <div style={{ height: "calc(100vh - 220px)", width: "100%", overflow: "auto" }}>
          <Container>
            {!loading ? (
              Object.keys(reportedStats).map((e, i) => {
                const stat = reportedStats[i];
                return (
                  <ThemeProvider theme={darkTheme}>
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
                        width: "150px",
                      }}
                    >
                      <Box sx={{ color: "text.secondary", width: "100%" }}>
                        {stat.fieldName.toUpperCase()}
                      </Box>
                      <Box
                        sx={{
                          color: "text.primary",
                          // width: "300px",
                          fontSize: 15,
                          fontWeight: "medium",
                        }}
                      >
                        {stat.fieldValue}
                      </Box>
                    </Box>
                  </ThemeProvider>
                );
              })
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "calc(100vh - 290px)",
                }}
              >
                <CircularProgress />
              </Box>
            )}
          </Container>
        </div>
      </TabPanel>
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

export default Team;
