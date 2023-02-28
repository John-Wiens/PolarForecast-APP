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
  let i = 0;
  while (i <= 3) {
    let newColumn = {
      field: "",
      headerName: "",
      filterable: false,
      disableExport: true,
      headerAlign: "center",
      align: "center",
      flex: 0.5,
      key: i
    };
    if (i === 0) {
      newColumn.headerName = "Blue Team";
      newColumn.field = "blue_team" ;
    } else if (i === 1) {
      newColumn.headerName = "Blue " + headerName;
      newColumn.field = "blue_" + fieldName;
    } else if (i === 2) {
      newColumn.headerName = "Red " + headerName;
      newColumn.field = "red_" + fieldName;
    } else if (i === 3) {
      newColumn.headerName = "Red Team";
      newColumn.field = "red_team" ;
    }
    tempColumns.push(newColumn);
    i = i + 1;
  }
  console.log(tempColumns);
  return tempColumns;
};

const Match = () => {
  const [tableColumns, setTableColumns] = useState([]);


  const [oprColumns, setOprColumns] = useState([generateColumns("opr", "OPR")]);
  const [oprRows, setOprRows] = useState([
    {
      key: 0,
      blue_team: "4499",
      blue_opr: 50,
      red_opr: 20,
      red_team: "1619",
    },
  ]);

  

  const matchInfoCallback = async (data) => {
    console.log(data);
    return data;
  };

  

  useEffect(() => {
    const url = new URL(window.location.href);
    const params = url.pathname.split("/");
    const year = params[3];
    const eventKey = params[4];
    const match = params[5].split("-")[1];

    getMatchDetails(year, eventKey, match, matchInfoCallback);
    // console.log(generateColumns("auto", "Auto"));
  }, []);

  // function TabPanel(props) {
  //   const { children, value, index, ...other } = props;
  //   return (
  //     <div
  //       role="tabpanel"
  //       hidden={value !== index}
  //       id={`full-width-tabpanel-${index}`}
  //       aria-labelledby={`full-width-tab-${index}`}
  //       // style={{width: "100%"}}
  //       {...other}
  //     >
  //       {value === index && (
  //         <Box sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 210px)" }}>
  //           <Typography>{children}</Typography>
  //         </Box>
  //       )}
  //     </div>
  //   );
  // }

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        {/* <div style={{ height: "calc(100vh - 175px)", overflow: "scroll" }}> */}
          <Container>
            {/* <Row>
              <div style={{ width: "100%" }}>
                <Card className="bg-gradient-default shadow">
                  <CardHeader className="bg-transparent">
                    <h3 className="text-white mb-0">BLUE 65 POINTS - RED 40 POINTS</h3>
                  </CardHeader>
                </Card>
              </div>
            </Row> */}

            <Row>
              <div style={{ height: "calc(100vh - 280px)", width: "100%" }}>
                <Card className="bg-gradient-default shadow">
                  <CardHeader className="bg-transparent">
                    <h3 className="text-white mb-0">OPR Comparison</h3>
                  </CardHeader>
                  <div style={{ height: "calc(100vh - 280px)", width: "100%" }}>
                    <DataGrid
                      disableColumnMenu
                      rows={oprRows}
                      getRowId={(row) => {
                        return row.key;
                      }}
                      columns={oprColumns}
                      pageSize={100}
                      rowsPerPageOptions={[100]}
                      sx={{
                        mx: 0.5,
                        border: 0,
                        borderColor: "white",
                        "& .MuiDataGrid-cell:hover": {
                          color: "white",
                        },

                        // color: 'white',
                      }}
                    />
                  </div>
                </Card>
              </div>
            </Row>
          </Container>
        {/* </div> */}
      </ThemeProvider>
    </>
  );
};

export default Match;
