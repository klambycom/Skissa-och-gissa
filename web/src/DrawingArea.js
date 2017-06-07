import React, { Component } from "react";
import Canvas from "./Canvas";

class DrawingArea extends Component {
  constructor(props) {
    super(props);

    this.is_drawing = false;

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  handleMouseDown(point) {
    this.is_drawing = true;
    this.canvas.start(point);
    this.canvas.continue(point);
  }

  handleMouseUp(e) {
    this.is_drawing = false;
  }

  handleMouseMove(point) {
    if (this.is_drawing) {
      this.canvas.continue(point);
    }
  }

  render() {
    return (
      <Canvas
        ref={(ref) => this.canvas = ref}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseMove={this.handleMouseMove}
      />
    );
  }
}

export default DrawingArea;
