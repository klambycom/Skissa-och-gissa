import React, { Component } from "react";
import PropTypes from "prop-types";
import bem from "bem-cn";

import "./Pencil.css";

import Color from "./Color";
import Size from "./Size";

const b = bem("Pencil");

class Pencil extends Component {
  constructor(props) {
    super(props);

    this.state = {
      color: props.colors[0],
      size: props.sizes[0]
    };
  }

  componentDidMount() {
    this.props.onChange(this.state.color, this.state.size);
  }

  handleClick(color, size) {
    this.props.onChange(color, size);
    this.setState({color, size});
  }

  render() {
    return (
      <div className={b}>
        <div className={b("colors")}>
          <span className={b("headline")}>Colors</span>
          {this.props.colors.map((rgb, i) => (
            <Color
              key={i}
              color={rgb}
              onClick={(color) => this.handleClick(color, this.state.size)}
              selected={this.state.color === rgb}
            />
          ))}
        </div>

        <div className={b("sizes")}>
          {this.props.sizes.map((size, i) => (
            <Size
              key={i}
              size={size}
              onClick={(size) => this.handleClick(this.state.color, size)}
              selected={this.state.size === size}
            />
          ))}
        </div>
      </div>
    );
  }
}

Pencil.propTypes = {
  onChange: PropTypes.func.isRequired,
  colors: PropTypes.array.isRequired,
  sizes: PropTypes.array.isRequired
};

export default Pencil;
