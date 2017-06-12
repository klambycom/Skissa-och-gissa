import React from "react";
import bem from "bem-cn";

import "./Page.css";

function Page(props) {
  return (
    <div className={bem("Page")}>
      {props.children}
    </div>
  );
}

export default Page;
