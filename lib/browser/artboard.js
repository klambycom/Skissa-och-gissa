/*jslint browser: true */
/*global SOG */

/**
 * @namespace browser
 */
SOG.utils.namespace('SOG.browser.artboard');

/**
 * Makes the canvas word. Uses
 * {{#crossLink "browser.points"}}points{{/crossLink}}.
 *
 * @class artboard
 * @static
 */
SOG.browser.artboard = (function (points) {
	'use strict';

	var context,
		painting,
		startDrawing,
		stopDrawing,
		drawing,
		addPoint,
		draw,
		drawAll,
		offsetX,
		offsetY,
		changeCrayon,
		room,
		receivePoint;

	/**
	 * Sets painting to true and add points.
	 *
	 * @method startDrawing
	 * @private
	 * @param e {object} Mouse-event.
	 */
	startDrawing = function (e) {
		painting = true;
		addPoint(e.pageX, e.pageY);
	};

	/**
	 * Sets painting to false.
	 *
	 * @method stopDrawing
	 * @private
	 */
	stopDrawing = function () {
		painting = false;
	};

	/**
	 * Add point if painting is true.
	 *
	 * @method drawing
	 * @private
	 * @param e {object} Mouse-event.
	 */
	drawing = function (e) {
		if (painting) {
			addPoint(e.pageX, e.pageY, true);
		}
	};

	/**
	 * Adds a point and draw it direct.
	 *
	 * @method receivePoint
	 * @private
	 * @param data {object} The data for the point.
	 */
	receivePoint = function (data) {
		if (Array.isArray(data)) {
			points.addArray(data);
			points.each(draw);
		} else {
			points.add(data);
			points.last(draw);
		}
	};

	/**
	 * Adds a point and draw it direct. And sends it to the server.
	 *
	 * @method addPoint
	 * @private
	 * @param x {int} The x cordination.
	 * @param y {int} The y cordination.
	 * @param dragging {boolean} True if not first point.
	 */
	addPoint = function (x, y, dragging) {
		var xx = x - context.canvas.offsetLeft - offsetX,
			yy = y - context.canvas.offsetTop - offsetY,
			p = points.add(xx, yy, dragging);

		// Send points to server
		room.sendPoints(p.data());
		// Start drawing
		points.last(draw);
	};

	/**
	 * Draw line from previous to current point.
	 *
	 * @method draw
	 * @private
	 * @param prev {object} The previous point.
	 * @param curr {object} The current point.
	 */
	draw = function (prev, curr) {
		if (typeof prev === 'undefined' || prev.color !== curr.color || prev.size !== curr.size) {
			// Pencil style
			context.strokeStyle = curr.color;
			context.lineWidth = curr.size;
		}

		// Drawing
		context.beginPath();

		if (curr.dragging) {
			context.moveTo(prev.x, prev.y);
		} else {
			context.moveTo(curr.x - 0.1, curr.y - 0.1); // Make a dot
		}
		context.lineTo(curr.x, curr.y);

		context.closePath();
		context.stroke();
	};

	/**
	 * Draw line from previous to current point, with all points.
	 *
	 * @method drawAll
	 * @private
	 */
	drawAll = function () {
		// Clear the canvas
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);

		// Pencil style
		context.lineJoin = 'round';

		// Start drawing
		points.each(draw);
	};

	/**
	 * Change class of canvas to the crayon.
	 *
	 * @method changeCrayon
	 * @private
	 * @param color {string} The color.
	 */
	changeCrayon = function (color) {
		// Remove all colors from cursor
		['white', 'black', 'red', 'orange', 'yellow', 'yellowgreen', 'green', 'lightskyblue', 'dodgerblue', 'violet', 'pink', 'burlywood', 'saddlebrown', 'brown'].forEach(function (c) {
			context.canvas.classList.remove(c + '_crayon');
		});
		// Add cursor with right color
		context.canvas.classList.add(color + '_crayon');

		return color;
	};

	return {
		/**
		 * Constructor
		 *
		 * @method init
		 * @param opt {object} Options.
		 *     @param opt.canvas {node} The canvas.
		 *     @param opt.room {object} The room.
		 *     @param opt.x {int} Offset on x-axis.
		 *     @param opt.y {int} Offset on y-axis.
		 */
		init: function (opt) {
			// Prevent Chrome from selecting the canvas
			// TODO Set on document? No need to select anything?
			opt.canvas.onselectstart = function () { return false; };
			opt.canvas.onmousedown = function () { return false; };
			// Set room
			room = opt.room;
			// Offset if needed
			offsetX = opt.x || 0;
			offsetY = opt.y || 0;
			// Set up artboard
			context = opt.canvas.getContext('2d');
			this.clear();
			// Receive one point from server
			room.onReceivePoint(receivePoint);
		},

		/**
		 * Enable drawing.
		 *
		 * @method enable
		 */
		enable: function () {
			// Set up drawing events 
			context.canvas.addEventListener('mousedown', startDrawing);
			context.canvas.addEventListener('mouseup', stopDrawing);
			context.canvas.addEventListener('mousemove', drawing);
			context.canvas.addEventListener('mouseleave', stopDrawing); // Firefox etc.
			context.canvas.addEventListener('mouseout', stopDrawing); // Chrome
		},

		/**
		 * Disable drawing.
		 *
		 * @method disable
		 */
		disable: function () {
			// Remove drawing events 
			context.canvas.removeEventListener('mousedown', startDrawing);
			context.canvas.removeEventListener('mouseup', stopDrawing);
			context.canvas.removeEventListener('mousemove', drawing);
			context.canvas.removeEventListener('mouseleave', stopDrawing); // Firefox etc.
			context.canvas.removeEventListener('mouseout', stopDrawing); // Chrome
		},

		/**
		 * Clears the artboard and remove all points.
		 *
		 * @method clear
		 */
		clear: function () {
			painting = false;
			// Remove all points
			points.clear();
			// Clear the canvas
			context.clearRect(0, 0, context.canvas.width, context.canvas.height);
			// Pencil style
			context.lineJoin = 'round';
			// Change cursor
			changeCrayon('red');
		},

		/**
		 * Set color and crayon.
		 *
		 * @method setColor
		 * @param c {string} The color.
		 */
		setColor: points.setColor.composite(changeCrayon),

		/**
		 * Set the size.
		 *
		 * @method setSize
		 * @param size {int} The size of the crayon.
		 */
		setSize: points.setSize,

		/**
		 * Change size to 20 and color to white.
		 *
		 * @method eraser
		 */
		eraser: function () {
			points.setSize(20);
			points.setColor('white');
		},

		/**
		 * Get image from the canvas.
		 *
		 * @method getImage
		 * @return Returns a string with the base64 image.
		 */
		getImage: function () {
			if (points.nrOfPoints() > 10) {
				return context.canvas.toDataURL();
			}

			return '';
		}
	};
}(SOG.browser.points));
