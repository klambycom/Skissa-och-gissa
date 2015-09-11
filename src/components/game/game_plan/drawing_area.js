var React = require('react');

var points = (function () {
  var color = '#df4b26';
  var size = 5;
  var points = [];
  var forEach = function (fn, a) { a.forEach(fn); };

  var Point = function (x, y, dragging, color, size) {
    this.getX = function () { return x; };
    this.getY = function () { return y; };
    this.getColor = function () { return color; };
    this.getSize = function () { return size; };
    this.getDragging = function () { return dragging; };
  };

  Point.prototype.data = function () {
    return {
      x: this.getX(),
      y: this.getY(),
      color: this.getColor(),
      size: this.getSize(),
      dragging: this.getDragging()
    }
  };

  var add = function (x, y, dragging) {
    var p;
    if (x instanceof Object) {
      p = new Point(x.x, x.y, !!x.dragging, x.color, x.size);
    } else {
      p = new Point(x, y, !!dragging, color, size);
    }
    points.push(p);
    return p;
  };

  var getPrevAndCurrPoints = function (i) {
    return [ points[i - 1] && points[i - 1].data(), points[i].data() ];
  };

  return {
    /**
     * Add a new Point to the drawing.
     *
     * @method add
     * @param x {int} The x cordination.
     * @param y {int} The y cordination.
     * @param dragging {boolean} True if its not the first point in current line.
     * @return Returns the newly created Point.
     */

    add: add,

    addArray: forEach.bind(null, add),

    nrOfPoints: function () { return points.length; },

    /**
     * Set the color. All points after the color is changed till its
     * changed again will have the same color.
     *
     * @method setColor
     * @param c {string} The new color.
     */

    setColor: function (c) { color = c; },

    /**
     * Set the size. All points after the size is changed til its changed
     * again will have the same size.
     *
     * @method setSize
     * @param s {int} The new size.
     */

    setSize: function (s) { size = s; },

    /**
     * Remove all points.
     *
     * @method clear
     */

    clear: function () { points = []; },

    /**
     * Iterate through each point.
     *
     * @method each
     * @param fn {function} Callback function that takes two parameters
     *                      (previous and current). Previous is undefined
     *                      if its the first point.
     */

    each: function (fn) {
      for (var i = 0; i < points.length; i += 1) {
        fn.apply(null, getPrevAndCurrPoints(i));
      }
    },

    /**
     * Gets the previous and the current point.
     *
     * @method last
     * @param fn {function} Callbakc function that takes two parameters
     *                      (previous and current). Previous is undefined
     *                      if its the first point.
     */

    last: function (fn) {
      fn.apply(null, getPrevAndCurrPoints(points.length - 1));
    }
  };
}());

module.exports = React.createClass({
  propTypes: {
    offsetX: React.PropTypes.number,
    offsetY: React.PropTypes.number
  },

  getDefaultProps: function () {
    return { offsetX: 0, offsetY: 0 };
  },

  getInitialState: function () {
    return { painting: false };
  },

  componentDidMount: function () {
    this.context = this.refs.canvas.getDOMNode().getContext('2d');

    // Prevent Chrome from selecting the canvas
    this.context.canvas.onselectstart = function () { return false; };
    this.context.canvas.onmousedown = function () { return false; };

    this._clear();

    this._start(); // TODO Remove!
  },

  componentDidUpdate: function () {
    // Need to upadate the context when the component is updated or
    // this.context will be undefined.
    this.context = this.refs.canvas.getDOMNode().getContext('2d');
  },

  _start: function () {
    this.context.canvas.addEventListener('mousedown', this._startDrawing);
    this.context.canvas.addEventListener('mouseup', this._stopDrawing);
    this.context.canvas.addEventListener('mousemove', this._drawing);
    this.context.canvas.addEventListener('mouseleave', this._stopDrawing); // Firefox etc.
    this.context.canvas.addEventListener('mouseout', this._stopDrawing); // Chrome
  },

  _stop: function () {
    this.context.canvas.removeEventListener('mousedown', this._startDrawing);
    this.context.canvas.removeEventListener('mouseup', this._stopDrawing);
    this.context.canvas.removeEventListener('mousemove', this._drawing);
    this.context.canvas.removeEventListener('mouseleave', this._stopDrawing); // Firefox etc.
    this.context.canvas.removeEventListener('mouseout', this._stopDrawing); // Chrome
  },

  _clear: function () {
    this.setState({ painting: false });
    // Remove all points
    points.clear();
    // Clear the canvas
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    // Pencil style
    this.context.lineJoin = 'round';
  },

  _addPoint: function (x, y, dragging) {
    var xx = x - this.context.canvas.offsetLeft - this.props.offsetX;
    var yy = y - this.context.canvas.offsetTop - this.props.offsetY;
    var p = points.add(xx, yy, dragging);

    // Send points to server
    //room.sendPoints(p.data());
    // Start drawing
    points.last(this._drawLine);
  },

  _startDrawing: function (e) {
    this.setState({ painting: true });
		this._addPoint(e.pageX, e.pageY);
	},

  _stopDrawing: function () {
    this.setState({ painting: false });
	},

  _drawing: function (e) {
		if (this.state.painting) {
			this._addPoint(e.pageX, e.pageY, true);
		}
	},

  // former draw() TODO Remove this comment!!!!
  _drawLine: function (prev, curr) {
		if (typeof prev === 'undefined' || prev.color !== curr.color || prev.size !== curr.size) {
			// Pencil style
			this.context.strokeStyle = curr.color;
			this.context.lineWidth = curr.size;
		}

		// Drawing
		this.context.beginPath();

		if (curr.dragging) {
			this.context.moveTo(prev.x, prev.y);
		} else {
			this.context.moveTo(curr.x - 0.1, curr.y - 0.1); // Make a dot
		}
		this.context.lineTo(curr.x, curr.y);

		this.context.closePath();
		this.context.stroke();
	},

  render: function () {
    return (
        <div id="artboard-wrapper">
          <canvas id="artboard" width="800" height="600" ref="canvas"></canvas>
        </div>
        );
  }
});
