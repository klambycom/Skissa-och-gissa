import React from "react";
import PropTypes from "prop-types";
import bem from "bem-cn";

import Input from "./Input";

const b = bem("Chat");

function handleInput(props) {
  return (message) => {
    if (message.charAt(0) === "/") {
      let command = message.split(" ")[0];
      let rest = message.substr(message.indexOf(" ") + 1);

      props.onCommand(command.substring(1), rest);
    }
    else {
      props.onMessage(message);
    }
  };
}

function Chat(props) {
  return (
    <div className={b}>
      <div className={b("messages")}>
        {props.messages.map((message, i) => <div key={i}>{message}</div>)}
      </div>

      <Input onEnter={handleInput(props)} />
    </div>
  );
}

Chat.defaultProps = {
  messages: []
};

Chat.propTypes = {
  onMessage: PropTypes.func.isRequired,
  onCommand: PropTypes.func.isRequired,
  messages: PropTypes.array
};

export default Chat;
