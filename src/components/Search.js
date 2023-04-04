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
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { getSearchKeys } from "api.js";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const Search = (props) => {
  const [searchKeys, setSearchKeys] = useState([]);
  const width = props.width || "300px";

  const searchKeyCallback = async (data) => {
    const terms = [];
    for (let i = 0; i < data.data.length; i++) {
      if ("display" in data.data[i]) {
        terms.push({ label: String(data.data[i].display), page: data.data[i].page });
      }
    }
    setSearchKeys(terms);
  };

  useEffect(() => {
    getSearchKeys(searchKeyCallback);
  }, []);

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#00000",
      },
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Autocomplete
        options={searchKeys ? searchKeys : []}
        loading
        renderInput={(params) => <TextField {...params} label="Select An Event" />}
        onChange={(event, newValue) => {
          window.location.href = newValue.page;
        }}
        sx={{
          width: { width },
          padding: 1,
        }}
      />
    </ThemeProvider>
  );
};

export default Search;
