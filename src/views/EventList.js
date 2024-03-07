import Chart from "chart.js";
import { Card, CardHeader, Container, Row } from "reactstrap";
import { useMediaQuery, useTheme } from "@mui/material";
import { chartOptions, parseOptions } from "variables/charts.js";
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { GridToolbar } from "@mui/x-data-grid";
import { Box, CircularProgress } from "@mui/material";
import StripedDataGrid from '../components/StripedDataGrid.js';
import PolarTheme from "../components/PolarTheme.js"; 

const EventList = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [containerHeight, setContainerHeight] = useState(`calc(100vh - 170px)`);
  const [leaderboardRows, setLeaderboardRows] = useState([]);
  const [leaderboardColumns, setLeaderboardColumns] = useState([
    {
      field: "id",
      headerName: "",
      filterable: false,
      sortable: false,
      renderCell: (index) => index.api.getRowIndexRelativeToVisibleRows(index.row.key) + 1,
      disableExport: true,
      GridColDef: "center",
      flex: 0.1,
    },
    {
      field: "key",
      headerName: "Team",
      headerAlign: "center",
      align: "center",
      minWidth: 75,
      flex: 0.5,
    }
  ]);
  


  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  useEffect(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    // getLeaderboard(currentYear, leaderboardCallback);
    if (!isDesktop) {
      setContainerHeight(`calc(100vh - 180px)`);
    } else {
      setContainerHeight(`calc(100vh - 170px)`)
    }
  }, [isDesktop]);

  return (
    <>
      <div style={{ height: containerHeight, width: "100%" }}>
        <ThemeProvider theme={PolarTheme}>
          <Container>
            <Row>
              <div style={{ height: containerHeight, width: "100%" }}>
                <Card className="polar-box">
                  <CardHeader className="bg-transparent">
                    <h3 className="text-white mb-0">Global Leaderboard</h3>
                  </CardHeader>
                  <div style={{ height: containerHeight, width: "100%" }}>
                    {leaderboardRows.length > 0 ? (
                      <StripedDataGrid
                        disableColumnMenu
                        initialState={{
                          pagination: { paginationModel: { pageSize: 50 } },
                        }}
                        rows={leaderboardRows}
                        getRowId={(row) => {
                          return row.key;
                        }}
                        sortingOrder={["desc", "asc"]}
                        columns={leaderboardColumns}
                        pageSize={100}
                        rowsPerPageOptions={[100]}
                        rowHeight={35}
                        disableExtendRowFullWidth={true}
                        sx={{
                          boxShadow: 2,
                          border: 0,
                          borderColor: "white",
                          "& .MuiDataGrid-cell:hover": {
                            color: "white",
                          },
                        }}
                        slots={{ toolbar: GridToolbar }}
                        slotProps={{
                          toolbar: {
                            showQuickFilter: true,
                            quickFilterProps: { debounceMs: 500 },
                          },
                        }}
                        disableColumnFilter = {!isDesktop}
                        disableColumnSelector = {!isDesktop}
                        disableDensitySelector = {!isDesktop}
                        disableExportSelector = {!isDesktop}
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
      </div>    
    </>
  );
};

export default EventList;