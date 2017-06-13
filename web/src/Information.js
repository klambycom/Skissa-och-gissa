import React from "react";
import bem from "bem-cn";

import "./Information.css";

const b = bem("Information");

function Information(props) {
  return (
    <div className={b}>
      <h1>{props.title}</h1>
      <div className={b("text")}>
        {props.text}{" "}
        <span className={b("user_count")}>{props.users.length} user online.</span>
      </div>
    </div>
  );
}

export default Information;
