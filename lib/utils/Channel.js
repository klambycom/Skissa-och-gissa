/*jslint bitwise: true, nomen: true, white: true */
// Code largely from https://github.com/ajacksified/Mediator.js

var SOG = SOG || {};
SOG.utils = SOG.utils || {};

(function () {
	'use strict';

	var Channel = function (namespace, parent) {
		if (!(this instanceof Channel)) {
			return new Channel(namespace);
		}
		this.namespace = namespace || '';
		this._subscribers = [];
		this._channels = [];
		this._parent = parent;
		this.stopped = false;
	};

	Channel.prototype = {
		addSubscriber: function (fn, options, context) {
			var subscriber = new SOG.utils.Subscriber(fn, options, context);

			if (options && options.priority !== undefined) {
				// Return 1 or 0. Faster than parseInt. Won't return a NaN.
				options.priority = options.priority >> 0;

				if (options.priority < 0) { options.priority = 0; }
				if (options.priority > this._subscribers.length) { options.priority = this._subscribers.length - 1; }

				this._subscribers.splice(options.priority, 0, subscriber);
			} else {
				this._subscribers.push(subscriber);
			}

			subscriber.channel = this;

			return subscriber;
		},

		stopPropagation: function () {
			this.stopped = true;
		},

		getSubscriber: function (identifier) {
			var x = 0,
				y = this._subscribers.length;

			for (x, y; x < y; x += 1) {
				if (this._subscribers[x].id === identifier || this._subscribers[x].fn === identifier) {
					return this._subscribers[x];
				}
			}
		},

		setPriority: function (identifier, priority) {
			var oldIndex = 0, x = 0, sub, firstHalf, lastHalf, y;

			for (x = 0, y = this._subscribers.length; x < y; x += 1) {
				if (this._subscribers[x].id === identifier || this._subscribers[x].fn === identifier) {
					break;
				}
				oldIndex += 1;
			}

			sub = this._subscribers[oldIndex];
			firstHalf = this._subscribers.slice(0, oldIndex);
			lastHalf = this._subscribers.slice(oldIndex + 1);

			this._subscribers = firstHalf.concat(lastHalf);
			this._subscribers.splice(priority, 0, sub);
		},

		addChannel: function (channel) {
			this._channels[channel] = new Channel((this.namespace ? this.namespace + ':' : '') + channel, this);
		},

		hasChannel: function (channel) {
			return this._channels.hasOwnProperty(channel);
		},

		returnChannel: function (channel) {
			return this._channels[channel];
		},

		removeSubscriber: function (identifier) {
			var x = this._subscribers.length - 1;

			// If we don't pass in an id, we're clearing all
			if (!identifier) {
				this._subscribers = [];
				return;
			}

			for (x; x >= 0; x -= 1) {
				if (this._subscribers[x].fn === identifier || this._subscribers[x].id === identifier) {
					this._subscribers[x].channel = null;
					this._subscribers.splice(x, 1);
				}
			}
		},

		publish: function (data) {
			var x = 0, y = this._subscribers.length, called = false, subscriber, l;

			for (x, y; x < y; x += 1) {
				if (!this.stopped) {
					subscriber = this._subscribers[x];
					if (subscriber.options !== undefined && typeof subscriber.options.predicate === 'function') {
						if (subscriber.options.predicate.apply(subscriber.context, data)) {
							subscriber.fn.apply(subscriber.context, data);
							called = true;
						}
					} else {
						subscriber.fn.apply(subscriber.context, data);
						called = true;
					}
				}

				if (called && subscriber.options && subscriber.options !== undefined) {
					subscriber.options.calls -= 1;

					if (subscriber.options.calls < 1) {
						this.removeSubscriber(subscriber.id);
						y -= 1;
						x -= 1;
					} else {
						subscriber.update(subscriber.options);
					}
				}
			}

			if (this._parent) {
				this._parent.publish(data);
			}

			this.stopped = false;
		}
	};

	SOG.utils.Channel = Channel;
}());
