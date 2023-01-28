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
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Container,
  Row,
  UncontrolledTooltip
} from "reactstrap";



// core components
import Header from "components/Headers/Header.js";
import React, { useEffect, useState } from 'react';
import { getStatDescription, getRankings } from "api.js";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

const Tables = () => {
  const [statDescription, setStatDescription] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [showKeys, setShowKeys] = useState([]);
  const [statColumns, setStatColumns] = useState([]);
  const [statRows, setStatRows] = useState([]);
  

  const [search, setSearch] = useState('');

  const statDescriptionCallback = async (data) => {
    const keys = [];
    const statColumns = [];
    
    // Setup a Column for Row Numbers
    statColumns.push({
      field: 'id' , 
      headerName: '', 
      filterable: false,
      renderCell:(index) => index.api.getRowIndex(index.row.key)+1
    });


    for (let i = 0; i < data.data.length; i++) {
      const stat = data.data[i];
      if (stat.report_stat) {
        keys.push(stat.stat_key);
        statColumns.push({field: stat.stat_key, headerName: stat.display_name, type:"number"})
      }
    }

    
    setShowKeys(keys);
    setStatDescription(data.data);
    setStatColumns(statColumns);


    



  }

  const rankingsCallback = async (data) => {
    setRankings(data.data);
  }

  const onInputChange = e => {
    setSearch(e.target.value);
  }

  useEffect(() => {
    const url = new URL(window.location.href);
    const params = url.pathname.split("/");
    const year = params[3];
    const eventKey = params[4];
    getStatDescription(year, eventKey, statDescriptionCallback);
    getRankings(year, eventKey, rankingsCallback)

  }, []);

  const rows = [
    // { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    // { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    // { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    // { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    // { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    // { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    // { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    // { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    // { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  ];

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 90,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (params) =>
        `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
  ];


  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Event Rankings</h3>
              </CardHeader>
              <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={rankings}
                  getRowId={row=>{
                      return row.key;
                  }}
                  columns={statColumns}
                  pageSize={100}
                  rowsPerPageOptions={[100]}
                  checkboxSelection
                  // getRowId= {(row) => row.code}
                />
              </div>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Tables;
