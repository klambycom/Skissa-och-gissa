// @flow

import React from "react";
import bem from "bem-cn";

import Input from "./Input";
import MessageList from "./MessageList";

import "./Chat.css";

const b = bem("Chat");

type Props = {
  onMessage(message: string): void,
  onCommand(command: string, rest: string): void,
  messages: Array<React.Element<any>>
}

function handleInput(props: Props): Function {
  return (message: string) => {
    if (message.charAt(0) === "/") {
      let command: string = message.split(" ")[0];
      let rest: string = message.substr(message.indexOf(" ") + 1);

      props.onCommand(command.substring(1), rest);
    }
    else {
      props.onMessage(message);
    }
  };
}

function Chat(props: Props): React.Element<any> {
  return (
    <div className={b}>
      <div className={b("messages")}>
        <MessageList messages={props.messages} />
      </div>

      <Input onEnter={handleInput(props)} />
    </div>
  );
}

export default Chat;
