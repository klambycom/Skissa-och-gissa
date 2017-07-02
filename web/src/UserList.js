// @flow

import React from "react";
import bem from "bem-cn";

import User from "./User";
import Avatar from "./Avatar";

import "./UserList.css";

const b = bem("UserList");

function UserList(props: {users: Array<User>}): React.Element<any> {
  return (
    <div className={b}>
      {props.users.map((user, i) => (
        <div className={b("user")} key={i}>
          <Avatar name={user.name} />
          {user.name}
        </div>
      ))}
    </div>
  );
}

export default UserList;
