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
import picture from "../../assets/img/brand/PolarbearHead.png";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { IconButton } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

const Header = () => {

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  return (
    <>
      <div
        style={{
          background:"linear-gradient(87deg, #11cdef 0, #1171ef 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid container spacing={3}>
        <Grid item xs>

        </Grid>
        <Grid item xs={6} style={{textAlign: "center"}}>
                  <Link to="/data/index">
          <img src={picture} alt={"logo"} />
        </Link>
        </Grid>
        <Grid item xs>
          <Button>
            SEARCH
          </Button>
        </Grid>
      </Grid>

      </div>
    </>
  );
};

export default Header;
