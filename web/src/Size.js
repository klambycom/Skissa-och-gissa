import React from "react";
import PropTypes from "prop-types";

function Size(props) {
  return (
    <button
      onClick={() => props.onClick(props.size)}
    >
      {props.selected ? "Selected" : `${props.size}px`}
    </button>
  );
}

Size.propTypes = {
  onClick: PropTypes.func.isRequired,
  size: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired
};

export default Size;
