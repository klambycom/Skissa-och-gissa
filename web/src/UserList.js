// @flow

import React from "react";

type User = {
  onlineAt: string,
  user: string
};

function UserList(props: {users: Array<User>}): React.Element<any> {
  return (
    <div>
      {props.users.map(({user, onlineAt}, i) => <div key={i}>{user}</div>)}
    </div>
  );
}

export default UserList;
