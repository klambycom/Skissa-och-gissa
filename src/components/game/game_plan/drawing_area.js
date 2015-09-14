var React = require('react');
var Reflux = require('reflux');
var Logic = require('../../../browser/logic');

module.exports = React.createClass({
  mixins: [Reflux.listenTo(Logic.store, 'handleCanvasUpdate')],

  propTypes: {
    offsetX: React.PropTypes.number,
    offsetY: React.PropTypes.number
  },

  getDefaultProps: function () {
    return { offsetX: 0, offsetY: 0 };
  },

  getInitialState: function () {
    return { painting: false, color: '', playersTurn: false };
  },

  componentDidMount: function () {
    this.context = this.refs.canvas.getDOMNode().getContext('2d');

    // Prevent Chrome from selecting the canvas
    this.context.canvas.onselectstart = function () { return false; };
    this.context.canvas.onmousedown = function () { return false; };

    this.setState({ color: Logic.store.crayon.color });
    this._clear();

    this._start(); // TODO Remove!
  },

  componentDidUpdate: function () {
    // Need to upadate the context when the component is updated or
    // this.context will be undefined.
    this.context = this.refs.canvas.getDOMNode().getContext('2d');
  },

  handleCanvasUpdate: function (canvas) {
    if (canvas.event === 'canvas') {
      // Change crayon color and/or size
      if (canvas.type === 'crayon') {
        this.setState({ color: canvas.data.color });
      }
      // Add new point to canvas
      else if (canvas.type === 'point') {
        canvas.data.last(this._drawLine);
      }
      // Clear canvas
      else if (canvas.type === 'clear') {
        this._clear();
        this._stop();
      }
    }
  },

  _start: function () {
    this.context.canvas.addEventListener('mousedown', this._startDrawing);
    this.context.canvas.addEventListener('mouseup', this._stopDrawing);
    this.context.canvas.addEventListener('mousemove', this._drawing);
    this.context.canvas.addEventListener('mouseleave', this._stopDrawing); // Firefox etc.
    this.context.canvas.addEventListener('mouseout', this._stopDrawing); // Chrome
    this.setState({ playersTurn: true });
  },

  _stop: function () {
    this.context.canvas.removeEventListener('mousedown', this._startDrawing);
    this.context.canvas.removeEventListener('mouseup', this._stopDrawing);
    this.context.canvas.removeEventListener('mousemove', this._drawing);
    this.context.canvas.removeEventListener('mouseleave', this._stopDrawing); // Firefox etc.
    this.context.canvas.removeEventListener('mouseout', this._stopDrawing); // Chrome
    this.setState({ playersTurn: false });
  },

  _clear: function () {
    this.setState({ painting: false });
    // Clear the canvas
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    // Pencil style
    this.context.lineJoin = 'round';
  },

  _addPoint: function (x, y, dragging) {
    var xx = x - this.context.canvas.offsetLeft - this.props.offsetX;
    var yy = y - this.context.canvas.offsetTop - this.props.offsetY;
    Logic.actions.canvas.point(xx, yy, dragging);
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

  _crayonClass: function () {
    return this.state.playersTurn ? this.state.color + '_crayon' : '';
  },

  render: function () {
    return (
        <div id="artboard-wrapper">
          <canvas
            id="artboard"
            width="800"
            height="600"
            ref="canvas"
            className={this._crayonClass()}></canvas>
        </div>
        );
  }
});
