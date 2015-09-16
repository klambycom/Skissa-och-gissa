var React = require('react');
var Reflux = require('reflux');
var Logic = require('../../../browser/logic');

module.exports = React.createClass({
  displayName: 'DrawingArea',

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
    // Prevent Chrome from selecting the canvas
    this._ctx().canvas.onselectstart = function () { return false; };
    this._ctx().canvas.onmousedown = function () { return false; };

    this.setState({ color: Logic.store.crayon.color });
    this._clear();

    this.setState({ playersTurn: true }); // TODO Remove!
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
        this.setState({ playersTurn: canvas.data.playersTurn });
      }
      // Start drawing
      else if (canvas.type === 'start') {
        console.log('start drawing', this.state.playersTurn);
      }
    }
  },

  _ctx: function () { return this.refs.canvas.getDOMNode().getContext('2d'); },

  _clear: function () {
    this.setState({ painting: false });
    // Clear the canvas
    this._ctx().clearRect(0, 0, this._ctx().canvas.width, this._ctx().canvas.height);
    // Pencil style
    this._ctx().lineJoin = 'round';
  },

  _addPoint: function (x, y, dragging) {
    var xx = x - this._ctx().canvas.offsetLeft - this.props.offsetX;
    var yy = y - this._ctx().canvas.offsetTop - this.props.offsetY;
    Logic.actions.canvas.point(xx, yy, dragging);
  },

  _drawLine: function (prev, curr) {
		if (typeof prev === 'undefined' || prev.color !== curr.color || prev.size !== curr.size) {
			// Pencil style
			this._ctx().strokeStyle = curr.color;
			this._ctx().lineWidth = curr.size;
		}

		// Drawing
		this._ctx().beginPath();

		if (curr.dragging) {
			this._ctx().moveTo(prev.x, prev.y);
		} else {
			this._ctx().moveTo(curr.x - 0.1, curr.y - 0.1); // Make a dot
		}
		this._ctx().lineTo(curr.x, curr.y);

		this._ctx().closePath();
		this._ctx().stroke();
	},

  handleStartDrawing: function (e) {
    this.setState({ painting: true });
		this._addPoint(e.pageX, e.pageY);
	},

  handleStopDrawing: function () {
    this.setState({ painting: false });
	},

  handleDrawing: function (e) {
		if (this.state.painting) {
			this._addPoint(e.pageX, e.pageY, true);
		}
	},

  render: function () {
    if (this.state.playersTurn) {
      return (
          <div id="artboard-wrapper">
            <canvas
              id="artboard"
              width="800"
              height="600"
              ref="canvas"
              onMouseDown={this.handleStartDrawing}
              onMouseUp={this.handleStopDrawing}
              onMouseMove={this.handleDrawing}
              onMouseLeave={this.handleStopDrawing}
              onMouseOut={this.handleStopDrawing}
              className={this.state.color + '_crayon'}></canvas>
          </div>
          );
    }

    return (
        <div id="artboard-wrapper">
          <canvas id="artboard" width="800" height="600" ref="canvas"></canvas>
        </div>
        );
  }
});
