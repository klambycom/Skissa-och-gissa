import React, { Component } from "react";
import { findDOMNode } from "react-dom";

class Canvas extends Component {
  constructor(props) {
    super(props);

    this.current = {x: 0, y: 0};
    this.is_drawing = false;

    this.start = this.start.bind(this);
    this.draw = this.draw.bind(this);
    this.line = this.line.bind(this);
    this.freeHand = this.freeHand.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.getCursorPosition = this.getCursorPosition.bind(this);

    //this.context.clearRect(0, 0, canvas.width, canvas.height);
  }

  componentDidMount() {
    this.canvas = findDOMNode(this.canvasRef);
    this.context = this.canvas.getContext("2d");
    this.context.lineJoin = "round";
  }

  set color(color) {
    this.context.strokeStyle = color;
  }

  set size(size) {
    this.context.lineWidth = size;
  }

  get base64() {
    return this.context.canvas.toDataURL();
  }

  start({x, y}) {
    this.current = {x: x - 0.1, y: y - 0.1};
    this.freeHand({x, y});
  }

  draw(point) {
    this.freeHand(point);
  }

  freeHand(point) {
    this.line(this.current, point);
    this.current = point;
  }

  line(from, to) {
    this.context.beginPath();
    this.context.moveTo(from.x, from.y);
    this.context.lineTo(to.x, to.y);
    this.context.closePath();
    this.context.stroke();
  }

  handleMouseDown(point) {
    this.is_drawing = true;
    this.start(this.getCursorPosition(point));
  }

  handleMouseUp(e) {
    this.is_drawing = false;
  }

  handleMouseMove(point) {
    if (this.is_drawing) {
      this.draw(this.getCursorPosition(point));
    }
  }

  getCursorPosition(e) {
    const {top, left} = this.context.canvas.getBoundingClientRect();
    return {x: e.clientX - left, y: e.clientY - top};
  }

  render() {
    return (
      <canvas
        ref={(ref) => this.canvasRef = ref}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseOut={this.handleMouseUp}
        onMouseMove={this.handleMouseMove}
      ></canvas>
    );
  }
}

export default Canvas;
