import React from "react";
import User from "../components/user";

class UserList extends React.Component {
  render() {
    let users = <li>Loading online users...</li>;
    if (this.props.users.length > 0) {
      users = this.props.users.map((x, i) => (
        <li key={i}><User name={x.user} onlineAt={x.onlineAt} /></li>
      ));
    }

    return (
      <div className="user_list">
        <h2>Who's Online</h2>
        <ul className="list-unstyled">{users}</ul>
      </div>
    );
  }
}

export default UserList;
