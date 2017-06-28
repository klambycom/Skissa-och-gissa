// @flow

import React, { Component } from "react";
import bem from "bem-cn";

import "./Pencil.css";

import Color from "./Color";
import Size from "./Size";

const b = bem("Pencil");

type RGB = {r: number, g: number, b: number};

type Props = {
  onChange(color: RGB, size: number): void,
  colors: Array<RGB>,
  sizes: Array<number>
};

class Pencil extends Component {
  state: {color: RGB, size: number};

  constructor(props: Props) {
    super(props);

    this.state = {
      color: props.colors[0],
      size: props.sizes[0]
    };
  }

  componentDidMount() {
    this.props.onChange(this.state.color, this.state.size);
  }

  handleClick(color: RGB, size: number): void {
    this.props.onChange(color, size);
    this.setState({color, size});
  }

  render(): React.Element<any> {
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

export default Pencil;
