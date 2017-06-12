import React from "react";

import UserList from "./UserList";

function Text(props) {
  return (
    <div>
      {props.body}
      <span>{props.user}</span>
    </div>
  );
}

function Users(props) {
  return (
    <div>
      <div>{props.body}</div>
      <div>
        <UserList users={props.users} />
      </div>
    </div>
  );
}

function MissingCommand(props) {
  return (<div>The command '{props.command}' was not recognised.</div>);
}

export default {Text, Users, MissingCommand};
