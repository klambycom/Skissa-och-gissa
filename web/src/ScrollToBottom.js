// @flow

import React from "react";
import bem from "bem-cn";

import "./ScrollToBottom.css";

type Props = {
  text: string,
  onClick: Function,
  isAtBottom: boolean,
  isScrollingDown: boolean
};

function ScrollToBottom(props: Props): ?React.Element<any> {
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
