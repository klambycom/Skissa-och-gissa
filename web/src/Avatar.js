// @flow

import React from "react";
import bem from "bem-cn";

import "./Avatar.css";

function getHashCode(str: string): number {
  let hash = 0;

  if (str.length === 0) {
    return hash;
  }

  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32bit integer
  }

  return hash;
}

function numberToHSL(hash: number, saturation: number = 100, lightness: number = 50): string {
  return `hsl(${hash % 360}, ${saturation}%, ${lightness}%)`;
}

function Avatar(props: {name: string}): React.Element<any> {
  const color = numberToHSL(getHashCode(props.name), 100, 35);

  return (
    <span className={bem("Avatar")} style={{background: color}}>C</span>
  );
}

export default Avatar;
