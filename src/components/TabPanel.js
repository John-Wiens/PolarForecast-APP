import React from 'react';
import { Box, ThemeProvider, Container } from '@mui/material';
import { Row } from "reactstrap";
import PolarTheme from './PolarTheme.js';

export default function TabPanel(props) {
  const { children, value, index, containerHeight, ...other } = props;
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
          <ThemeProvider theme={PolarTheme}>
            <Container>
              <Row>
                <div style={{ height: containerHeight, width: "100%" }}>{children}</div>
              </Row>
            </Container>
          </ThemeProvider>
        </Box>
      )}
    </div>
  );
}