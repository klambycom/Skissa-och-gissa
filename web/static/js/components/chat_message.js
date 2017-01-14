import React from "react";
import formatTimestamp from "../format_timestamp";

function ChatMessage(props) {
  return (
    <div className="chat__message">
      <div className="chat__message__body">{props.body}</div>
      <div className="chat__message__meta">
        <span className="chat__message__meta__user">{props.user}</span>
        <span className="chat__message__meta__timestamp">{formatTimestamp(props.timestamp)}</span>
      </div>
    </div>
  );
}

export default ChatMessage;
