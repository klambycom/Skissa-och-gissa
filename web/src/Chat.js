import React from "react";
import PropTypes from "prop-types";
import bem from "bem-cn";

import Input from "./Input";

const b = bem("Chat");

function Chat(props) {
  return (
    <div className={b}>
      <div className={b("messages")}>
        {props.messages.map((message, i) => <div key={i}>{message}</div>)}
      </div>

      <Input onEnter={(e) => props.onMessage(e)} />
    </div>
  );
}

Chat.defaultProps = {
  messages: []
};

Chat.propTypes = {
  onMessage: PropTypes.func.isRequired,
  messages: PropTypes.array
};

export default Chat;
