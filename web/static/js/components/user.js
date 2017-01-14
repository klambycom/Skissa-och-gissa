import React from "react";
import formatTimestamp from "../format_timestamp";

function User(props) {
  return (
    <div className="user">
      {props.name}
      <br />
      <small>online since {formatTimestamp(props.onlineAt)}</small>
    </div>
  );
}

User.propTypes = {
  name: React.PropTypes.string,
  onlineAt: React.PropTypes.number
};

export default User;
