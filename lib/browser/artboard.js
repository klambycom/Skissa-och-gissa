/*jslint browser: true */

var SOG = SOG || {};
SOG.browser = SOG.browser || {};

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
		drawLast;

	startDrawing = function (e) {
		painting = true;
		addPoint(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
		// Prevent Chrome from selecting the canvas
		document.onselectstart = function () { return false; };
	};

	stopDrawing = function () {
		painting = false;
		// Enable selection again
		document.onselectstart = function () { return true; };
	};

	drawing = function (e) {
		var x = e.pageX - this.offsetLeft,
			y = e.pageY - this.offsetTop;

		if (painting) {
			addPoint(x, y, true);
		}
	};

	addPoint = function (x, y, dragging) {
		points.add(x, y, dragging);
		drawLast();
	};

	draw = function (prev, curr) {
		// Pencil style
		context.strokeStyle = curr.color;
		context.lineWidth = curr.size;

		// Drawing
		context.beginPath();

		if (curr.dragging) {
			context.moveTo(prev.x, prev.y);
		}
		context.lineTo(curr.x, curr.y);

		context.closePath();
		context.stroke();
	};

	drawAll = function () {
		// Clear the canvas
		context.clearRect(0, 0, 490, 220);

		// Pencil style
		context.lineJoin = 'round';

		// Start drawing
		points.each(draw);
	};

	drawLast = function () {
		// Start drawing
		points.last(draw);
	};

	return {
		init: function (element) {
			// Set up artboard
			context = element.getContext('2d');
			this.clear();
			// Set up drawing events
			context.canvas.addEventListener('mousedown', startDrawing);
			context.canvas.addEventListener('mouseup', stopDrawing);
			context.canvas.addEventListener('mousemove', drawing);
			context.canvas.addEventListener('mouseleave', stopDrawing); // Firefox etc.
			context.canvas.addEventListener('mouseout', stopDrawing); // Chrome
		},

		clear: function () {
			painting = false;
			// Remove all points
			points.clear();
			// Clear the canvas
			context.clearRect(0, 0, 490, 220);
			// Pencil style
			context.lineJoin = 'round';
		},

		setColor: points.setColor,

		setSize: points.setSize,

		eraser: function () {
			points.setSize(20);
			points.setColor('white');
		}
	};
}(SOG.browser.points));
