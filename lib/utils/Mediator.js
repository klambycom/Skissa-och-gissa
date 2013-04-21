/*jslint bitwise: true, nomen: true, white: true */
// Code largely from https://github.com/ajacksified/Mediator.js

var SOG = SOG || {};
SOG.utils = SOG.utils || {};

SOG.utils.mediator = (function () {
	'use strict';

	var _channels = new SOG.utils.Channel(''),
		getChannel;

	getChannel = function (namespace) {
		var channel = _channels,
			namespaceHierarchy = namespace.split(':'),
			x = 0,
			y = namespaceHierarchy.length;

		if (namespace === '') { return channel; }

		if (namespaceHierarchy.length > 0) {
			for (x, y; x < y; x += 1) {
				if (!channel.hasChannel(namespaceHierarchy[x])) {
					channel.addChannel(namespaceHierarchy[x]);
				}

				channel = channel.returnChannel(namespaceHierarchy[x]);
			}
		}

		return channel;
	};

	return {
		subscribe: function (channelName, fn, options, context) {
			options = options || {};
			context = context || {};

			return getChannel(channelName).addSubscriber(fn, options, context);
		},

		once: function (channelName, fn, options, context) {
			options = options || {};
			options.calls = 1;

			return this.subscribe(channelName, fn, options, context);
		},

		getSubscriber: function (identifier, channel) {
			return getChannel(channel || '').getSubscriber(identifier);
		},

		remove: function (channelName, identifier) {
			getChannel(channelName).removeSubscriber(identifier);
		},

		publish: function (channelName) {
			var args = Array.prototype.slice.call(arguments, 1),
				channel = getChannel(channelName);

			args.push(channel);
			channel.publish(args);
		}
	};
}());
