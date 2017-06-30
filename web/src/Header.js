// @flow

import React from "react";
import bem from "bem-cn";
import {Link} from "react-router-dom";

import "./Header.css";

const b = bem("Header");

function Header(): React.Element<any> {
  return (
    <div className={b}>
      <Link to="/" className={b("logo")}>Skissaochgissa.se</Link>
    </div>
  );
}

export default Header;
