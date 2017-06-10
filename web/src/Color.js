import React from "react";
import PropTypes from "prop-types";
import bem from "bem-cn";
import "./Color.css";

function Color(props) {
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

Color.propTypes = {
  onClick: PropTypes.func.isRequired,
  color: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired
};

export default Color;
