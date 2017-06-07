import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import PropTypes from "prop-types";

class Canvas extends Component {
  constructor(props) {
    super(props);

    this.previous = {x: 0, y: 0};

    this.start = this.start.bind(this);
    this.line = this.line.bind(this);
    this.continue = this.continue.bind(this);
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

  /**
   * Save current position. It's needed if we are free-hand drawing.
   */
  start({x, y}) {
    this.previous = {x: x - 0.1, y: y - 0.1};
  }

  /**
   * Draw a line between previous point and the current point.
   */
  continue(point) {
    this.line(this.previous, point);
    this.previous = point;
  }

  /**
   * Draw a line between two points.
   */
  line(from, to) {
    this.context.beginPath();
    this.context.moveTo(from.x, from.y);
    this.context.lineTo(to.x, to.y);
    this.context.closePath();
    this.context.stroke();
  }

  getCursorPosition(e) {
    const {top, left} = this.context.canvas.getBoundingClientRect();
    return {x: e.clientX - left, y: e.clientY - top};
  }

  render() {
    return (
      <canvas
        ref={(ref) => this.canvasRef = ref}
        onMouseDown={(e) => this.props.onMouseDown(this.getCursorPosition(e))}
        onMouseUp={this.props.onMouseUp}
        onMouseOut={this.props.onMouseUp}
        onMouseMove={(e) => this.props.onMouseMove(this.getCursorPosition(e))}
        width={this.props.width}
        height={this.props.height}
      ></canvas>
    );
  }
}

Canvas.propTypes = {
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  onMouseMove: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number
};

export default Canvas;
