class Canvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.context.lineJoin = "round";
    this.current = {x: 0, y: 0};
    this.paths = [];
    this.context.clearRect(0, 0, canvas.width, canvas.height);
  }

  set color(color) {
    this.context.strokeStyle = color;
  }

  set size(size) {
    this.context.lineWidth = size;
  }

  get base64() {
    return this.canvas.toDataURL();
  }

  start({x, y}) {
    this.current = {x: x - 0.1, y: y - 0.1};
    this.draw({x, y});
  }

  draw({x, y}) {
    this.context.beginPath();
    this.context.moveTo(this.current.x, this.current.y);
    this.context.lineTo(x, y);
    this.context.closePath();
    this.context.stroke();

    this.current = {x, y};
  }
}

var canvas = document.getElementById("game");
var is_drawing = false;

var painting = new Canvas(canvas);
painting.color = "green";
painting.size = 5;

function handle_mousedown(e) {
  is_drawing = true;
  painting.start({x: e.layerX, y: e.layerY});
}

function handle_mouseup() {
  is_drawing = false;
}

function handle_mousemove(e) {
  if (is_drawing) {
    painting.draw({x: e.layerX, y: e.layerY});
  }
}

canvas.addEventListener("mousedown", handle_mousedown);
canvas.addEventListener("mouseup", handle_mouseup); // All
canvas.addEventListener("mouseleave", handle_mouseup); // Firefox etc.
canvas.addEventListener("mouseout", handle_mouseup); // Chrome
canvas.addEventListener("mousemove", handle_mousemove);
