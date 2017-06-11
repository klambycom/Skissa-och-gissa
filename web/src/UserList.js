import React from "react";

function UserList(props) {
  return (
    <div>
      {props.users.map(({user, onlineAt}, i) => <div key={i}>{user}</div>)}
    </div>
  );
}

export default UserList;
