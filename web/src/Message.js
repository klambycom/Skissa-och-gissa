// @flow

import React from "react";
import bem from "bem-cn";

import UserList from "./UserList";

import "./Message.css";

const b = bem("Message");

function Text(props: {body: string, user: string}): React.Element<any> {
  return (
    <div className={b("Text")}>
      <div className={b("Text", "body")}>{props.body}</div>
      <div className={b("Text", "user")}>{props.user}</div>
    </div>
  );
}

function Users(props: {body: string, users: Array<any>}): React.Element<any> {
  return (
    <div className={b("Users")}>
      <div className={b("Users", "body")}>{props.body}</div>
      <div className={b("Users", "list")}>
        <UserList users={props.users} />
      </div>
    </div>
  );
}

function MissingCommand(props: {command: string}): React.Element<any> {
  return (
    <div className={b("MissingCommand")}>
      The command '{props.command}' was not recognised.
    </div>
  );
}

export default {Text, Users, MissingCommand};
