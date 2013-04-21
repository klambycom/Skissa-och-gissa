/*jslint bitwise: true, nomen: true, white: true */
// Code largely from https://github.com/ajacksified/Mediator.js

var SOG = SOG || {};
SOG.utils = SOG.utils || {};

(function () {
	'use strict';

	var s4 = function () { return (((1 + Math.random()) * 0x10000)|0).toString(16).substring(1); },
		guidGenerator = function () { return (s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()); },
		Subscriber;

	Subscriber = function (fn, options, context) {
		if (!(this instanceof Subscriber)) {
			return new Subscriber(fn, options, context);
		}

		this.id = guidGenerator();
		this.fn = fn;
		this.options = options;
		this.context = context;
		this.channel = null;
	};

	Subscriber.prototype = {
		update: function (options) {
			if (options) {
				this.fn = options.fn || this.fn;
				this.context = options.context || this.context;
				this.options = options.options || this.options;
				if (this.channel && this.options && this.options.priority !== undefined) {
					this.channel.setPriority(this.id, this.options.priority);
				}
			}
		}
	};

	SOG.utils.Subscriber = Subscriber;
}());
