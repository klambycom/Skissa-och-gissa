// @flow

import React from "react";
import bem from "bem-cn";

import "./Color.css";

type RGB = {r: number, g: number, b: number};

type Props = {
  onClick(color: RGB): void,
  color: RGB,
  selected: boolean
};

function Color(props: Props) {
  const {r, g, b} = props.color;

  return (
    <button
      className={bem("Color")({selected: props.selected})}
      style={{background: `rgb(${r}, ${g}, ${b})`}}
      onClick={() => props.onClick(props.color)}
    >
    </button>
  );
}

export default Color;
