// @flow

import React from "react";

function Size(props: {onClick(size: number): void, size: number, selected: boolean}): React.Element<any> {
  return (
    <button onClick={() => props.onClick(props.size)}>
      {props.selected ? "Selected" : `${props.size}px`}
    </button>
  );
}

export default Size;
