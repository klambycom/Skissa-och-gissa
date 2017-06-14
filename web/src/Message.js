import React from "react";
import bem from "bem-cn";

import UserList from "./UserList";

import "./Message.css";

const b = bem("Message");

function Text(props) {
  return (
    <div className={b("Text")}>
      <div className={b("Text", "body")}>{props.body}</div>
      <div className={b("Text", "user")}>{props.user}</div>
    </div>
  );
}

function Users(props) {
  return (
    <div className={b("Users")}>
      <div>{props.body}</div>
      <div>
        <UserList users={props.users} />
      </div>
    </div>
  );
}

function MissingCommand(props) {
  return (
    <div className={b("MissingCommand")}>
      The command '{props.command}' was not recognised.
    </div>
  );
}

export default {Text, Users, MissingCommand};
