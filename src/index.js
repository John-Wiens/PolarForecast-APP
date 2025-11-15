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
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import DataLayout from "layouts/Data.js";

// Get the root DOM node
const container = document.getElementById("root");
const root = createRoot(container);

// Render the app
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/data/*" element={<DataLayout />} />
      <Route path="/" element={<Navigate to="/data/index" replace />} />
    </Routes>
  </BrowserRouter>
);


