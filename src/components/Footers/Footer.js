import * as React from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const Footer = () => {
  return (
    <Grid
      container
      component="footer"
      justifyContent="center"
      sx={{ position: "absolute", bottom: 0, width: "100%", padding: 0 }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ display: "flex", alignItems: "center" }}
      >
        © {new Date().getFullYear()}{" "}
        <a
          href="https://github.com/John-Wiens/PolarForecast-APP"
          target="_blank"
          rel="noreferrer"
          style={{
            textDecoration: "inherit",
            color: "inherit",
            marginLeft: "5px",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          <GitHubIcon fontSize="small" />
        </a>
      </Typography>
    </Grid>
  );
};

export default Footer;
