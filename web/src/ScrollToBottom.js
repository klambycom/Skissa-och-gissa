import React from "react";
import bem from "bem-cn";

import "./ScrollToBottom.css";

function ScrollToBottom(props) {
  if (props.isAtBottom || (!props.isAtBottom && props.isScrollingDown)) {
    return null;
  }

  return (
    <div className={bem("ScrollToBottom")}>
      <button onClick={(e) => props.onClick()}>{props.text}</button>
    </div>
  );
}

export default ScrollToBottom;
