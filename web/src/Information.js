// @flow

import React from "react";
import bem from "bem-cn";

import "./Information.css";

const b = bem("Information");

type User = {
  user: string,
  onlineAt: string
};

function Information(props: {title: string, text: string, users: Array<User>}): React.Element<any> {
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
