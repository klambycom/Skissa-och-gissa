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
		offsetX,
		offsetY,
		changeCrayon,
		room,
		receivePoint;

	startDrawing = function (e) {
		painting = true;
		addPoint(e.pageX, e.pageY);
	};

	stopDrawing = function () {
		painting = false;
	};

	drawing = function (e) {
		if (painting) {
			addPoint(e.pageX, e.pageY, true);
		}
	};

	receivePoint = function (data) {
		points.add(data);
		window.pp = points.test();
		points.last(draw);
	};

	addPoint = function (x, y, dragging) {
		var xx = x - context.canvas.offsetLeft - offsetX,
			yy = y - context.canvas.offsetTop - offsetY,
			p = points.add(xx, yy, dragging);

		// Send points to server
		room.sendPoints(p.data());
		// Start drawing
		points.last(draw);
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
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);

		// Pencil style
		context.lineJoin = 'round';

		// Start drawing
		points.each(draw);
	};

	changeCrayon = function (color) {
		// Remove all colors from cursor
		['blue_crayon', 'green_crayon', 'pink_crayon', 'yellow_crayon', 'red_crayon'].forEach(function (c) {
			context.canvas.classList.remove(c);
		});
		// Add cursor with right color
		context.canvas.classList.add(color + '_crayon');
	};

	return {
		init: function (opt) {
			// Prevent Chrome from selecting the canvas
			// TODO Set on document? No need to select anything?
			opt.canvas.onselectstart = function () { return false; };
			// Set room
			room = opt.room;
			// Offset if needed
			offsetX = opt.x || 0;
			offsetY = opt.y || 0;
			// Set up artboard
			context = opt.canvas.getContext('2d');
			this.clear();
			// Set up drawing events
			context.canvas.addEventListener('mousedown', startDrawing);
			context.canvas.addEventListener('mouseup', stopDrawing);
			context.canvas.addEventListener('mousemove', drawing);
			context.canvas.addEventListener('mouseleave', stopDrawing); // Firefox etc.
			context.canvas.addEventListener('mouseout', stopDrawing); // Chrome
			room.onReceivePoint(receivePoint); // Receive one point from server
		},

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

		setColor: function (c) {
			// Change color
			points.setColor(c);
			// Change cursor
			changeCrayon(c);
		},

		setSize: points.setSize,

		eraser: function () {
			points.setSize(20);
			points.setColor('white');
		},

		saveToImg: function () {
			return context.canvas.toDataURL();
		}
	};
}(SOG.browser.points));
