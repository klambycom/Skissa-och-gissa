// @flow

import React from "react";
import bem from "bem-cn";

import Canvas from "./Canvas";
import Pencil from "./Pencil";

import "./DrawingArea.css";

const b = bem("DrawingArea");

type RGB = {r: number, g: number, b: number};
type Point = {x: number, y: number};

const colors: Array<RGB> = [
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

const sizes: Array<number> = [5, 10, 15, 20];

type Props = {
  onPaint(point: Point, start: boolean): void,
  canvas(canvas: Canvas): any // I don't know why void don't work here
};

function DrawingArea(props: Props): React.Element<any> {
  let canvas: Canvas;
  let is_drawing: boolean = false;

  const handleMouseDown = (point: Point) => {
    is_drawing = true;
    canvas.start(point);
    canvas.continue(point);
    props.onPaint(point, true);
  };

  const handleMouseUp = () => {
    is_drawing = false;
  };

  const handleMouseMove = (point: Point) => {
    if (is_drawing) {
      canvas.continue(point);
      props.onPaint(point, false);
    }
  }

  const handlePencil = (color: RGB, size: number) => {
    canvas.color = color;
    canvas.size = size;
  }

  return (
    <div className={b}>
      <Canvas
        ref={(ref) => {
          canvas = ref;
          props.canvas(canvas);
        }}
        onMouseDown={(point) => handleMouseDown(point)}
        onMouseUp={() => handleMouseUp()}
        onMouseMove={(point) => handleMouseMove(point)}
        height={500}
        width={700}
      />

      <Pencil
        colors={colors}
        sizes={sizes}
        onChange={(color, size) => handlePencil(color, size)}
      />
    </div>
  );
}

export default DrawingArea;
