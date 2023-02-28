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
import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { getSearchKeys } from "api.js";

const Search = () => {
  const [searchKeys, setSearchKeys] = React.useState([]);

  const searchKeyCallback = async (data) => {
    const terms = [];
    for (let i = 0; i < data.data.length; i++) {
      if ("key" in data.data[i]) {
        terms.push({ label: String(data.data[i].key), page: data.data[i].page });
      }
    }
    setSearchKeys(terms);
  };

  React.useEffect(() => {
    getSearchKeys(searchKeyCallback);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: 20,
      }}
    >
      <Autocomplete
        id="combo-box-demo"
        options={searchKeys ? searchKeys : []}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Search" />}
        onChange={(event, newValue) => {
          window.location.href = newValue.page;
        }}
      />
    </div>
  );
};

export default Search;
