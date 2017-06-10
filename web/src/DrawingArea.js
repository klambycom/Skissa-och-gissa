import React, { Component } from "react";
import bem from "bem-cn";

import Canvas from "./Canvas";
import Pencil from "./Pencil";

import "./DrawingArea.css";

const b = bem("DrawingArea");

const colors = [
  {r: 0, g: 0, b: 0},
  {r: 255, g: 255, b: 255},
  {r: 255, g: 0, b: 0},
  {r: 255, g: 165, b: 0},
  {r: 255, g: 255, b: 0},
  {r: 154, g: 205, b: 50},
  {r: 0, g: 128, b: 0},
  {r: 135, g: 206, b: 250},
  {r: 30, g: 144, b: 255},
  {r: 238, g: 130, b: 238},
  {r: 255, g: 192, b: 203},
  {r: 222, g: 184, b: 135},
  {r: 139, g: 69, b: 19},
  {r: 165, g: 42, b: 42}
];

const sizes = [5, 10, 15, 20];

class DrawingArea extends Component {
  constructor(props) {
    super(props);

    this.is_drawing = false;
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

  handlePencil(color, size) {
    this.canvas.color = color;
    this.canvas.size = size;
  }

  render() {
    return (
      <div className={b}>
        <Canvas
          ref={(ref) => this.canvas = ref}
          onMouseDown={(point) => this.handleMouseDown(point)}
          onMouseUp={() => this.handleMouseUp()}
          onMouseMove={(point) => this.handleMouseMove(point)}
          height={500}
          width={700}
        />

        <Pencil
          colors={colors}
          sizes={sizes}
          onChange={(color, size) => this.handlePencil(color, size)}
        />
      </div>
    );
  }
}

export default DrawingArea;
