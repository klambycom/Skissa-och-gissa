// @flow

import React, { Component } from "react";
import bem from "bem-cn";

import "./Canvas.css";

type Point = {x: number, y: number};
type RGB = {r: number, g: number, b: number};

class Canvas extends Component {
  props: {
    onMouseDown(point: Point): void,
    onMouseUp(): void,
    onMouseMove(point: Point): void,
    width: number,
    height: number
  };

  previous: Point = {x: 0, y: 0};
  canvasRef: any; //HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  componentDidMount() {
    this.context = this.canvasRef.getContext("2d");
    this.context.lineJoin = "round";
  }

  set color({r, g, b}: RGB) {
    this.context.strokeStyle = `rgb(${r}, ${g}, ${b})`;
  }

  set size(size: number) {
    this.context.lineWidth = size;
  }

  get base64(): string {
    return this.context.canvas.toDataURL();
  }

  /**
   * Save current position. It's needed if we are free-hand drawing.
   */
  start({x, y}: Point): void {
    this.previous = {x: x - 0.1, y: y - 0.1};
  }

  /**
   * Draw a line between previous point and the current point.
   */
  continue(point: Point): void {
    this.line(this.previous, point);
    this.previous = point;
  }

  /**
   * Draw a line between two points.
   */
  line(from: Point, to: Point): void {
    this.context.beginPath();
    this.context.moveTo(from.x, from.y);
    this.context.lineTo(to.x, to.y);
    this.context.closePath();
    this.context.stroke();
  }

  getCursorPosition(e: Object): Point {
    const {top, left} = this.context.canvas.getBoundingClientRect();
    return {x: e.clientX - left, y: e.clientY - top};
  }

  render() {
    return (
      <canvas
        className={bem("Canvas")}
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

export default Canvas;
