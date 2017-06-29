// @flow

import React from "react";
import User from "./User";

function UserList(props: {users: Array<User>}): React.Element<any> {
  return (
    <div>
      {props.users.map((user, i) => <div key={i}>{user.name}</div>)}
    </div>
  );
}

export default UserList;
