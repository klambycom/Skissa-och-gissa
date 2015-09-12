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

	/**
	 * Sets painting to false.
	 *
	 * @method stopDrawing
	 * @private
	 */

	/**
	 * Add point if painting is true.
	 *
	 * @method drawing
	 * @private
	 * @param e {object} Mouse-event.
	 */

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

	/**
	 * Draw line from previous to current point.
	 *
	 * @method draw
	 * @private
	 * @param prev {object} The previous point.
	 * @param curr {object} The current point.
	 */

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
			// Change cursor
			this.setColor('red');
			// Receive one point from server
			room.onReceivePoint(receivePoint);
		},

		/**
		 * Disable drawing.
		 *
		 * @method disable
		 */

		/**
		 * Clears the artboard and remove all points.
		 *
		 * @method clear
		 */

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
