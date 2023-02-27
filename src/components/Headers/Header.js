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

const Header = () => {
  return (
    <>
      <div
        className="header bg-gradient-info pb-1 pt-4 pt-md-0"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Link to="/data/index">
          <img src={picture} alt={"logo"} />
        </Link>
      </div>
    </>
  );
};

export default Header;
