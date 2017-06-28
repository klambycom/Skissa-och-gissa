// @flow

import React from "react";
import bem from "bem-cn";

import "./Header.css";

function Header(): React.Element<any> {
  return (
    <div className={bem("Header")}>
      Skissaochgissa.se
    </div>
  );
}

export default Header;
