import React from "react";
import PropTypes from "prop-types";

function Color(props) {
  const {r, g, b} = props.color;

  return (
    <button
      style={{background: `rgb(${r}, ${g}, ${b})`}}
      onClick={() => props.onClick(props.color)}
    >
      {props.selected ? "Selected" : "Color"}
    </button>
  );
}

Color.propTypes = {
  onClick: PropTypes.func.isRequired,
  color: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired
};

export default Color;
