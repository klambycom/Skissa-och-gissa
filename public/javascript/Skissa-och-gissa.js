/*jslint white: true */

/**
 * Composite a new function of two functions.
 *
 * @class Function
 * @method compose
 * @example
 *     var greet = function (s) { return 'hi, ' + s; },
 *         exclaim = function (s) { return s + '!'; },
 *         excited_greeting = greet.compose(exclaim);
 *     excited_greeting('Pickman'); //=> hi, Pickman!
 */
Function.prototype.compose = function (/* functions */) {
	'use strict';

	// Save all functions in array
	var fns = [].slice.call(arguments);
	fns.unshift(this);

	// Create the new function
	return function (/* args */) {
		var args = [].slice.call(arguments), i;

		// Run args on all functions and save result
		// Run args on function and save result to next function
		for (i = fns.length - 1; i >= 0; i -= 1) {
			args = [fns[i].apply(this, args)];
		}

		// Return result from first function
		return args[0];
	};
};

/**
 * Partial Application (aka currying).
 * From http://dailyjs.com/2012/09/14/functional-programming/
 *
 * @class Function
 * @method curry
 * @example
 *     var add = function (x, y) { return x + y; },
 *         add_three = add.curry(3);
 *     add_three(4); //=> 7
 */
Function.prototype.curry = function () {
	'use strict';

	// capture the bound arguments
	var args = Array.prototype.slice.call(arguments),
		f = this;
	// construct a new function
	return function () {
		// prepend argument list with the closed arguments from above
		var inner_args = Array.prototype.slice.call(arguments);
		return f.apply(this, args.concat(inner_args));
	};
};

/**
 * Flipping a functions arguments.
 * From http://dailyjs.com/2012/09/14/functional-programming/
 *
 * @class Function
 * @method flip
 * @example
 *     var div = function (x, y) { return x / y; };
 *     div(1, 2); //=> 0.5
 *     div.flip()(1, 2); //=> 2
 */
Function.prototype.flip = function () {
	'use strict';

	// preserve f
	var f = this;
	// construct g
	return function () {
		var args = Array.prototype.slice.call(arguments);
		// flip arguments when called
		return f.apply(this, args.reverse());
	};
};
;/*global window, module */

var SOG = SOG || {};
SOG.utils = SOG.utils || {};

// Från boken JavaScript Patterns.
SOG.utils.namespace = function (ns_string) {
	'use strict';

	var parts = ns_string.split('.'),
		parent = SOG,
		i;

	// Strip redundant leading global
	if (parts[0] === 'SOG') {
		parts = parts.slice(1);
	}

	for (i = 0; i < parts.length; i += 1) {
		// Create a property if it doesn't exist
		if (typeof parent[parts[i]] === 'undefined') {
			parent[parts[i]] = {};
		}
		parent = parent[parts[i]];
	}
	return parent;
};
;/*global window, module */
var SOG = SOG || {};
SOG.utils = SOG.utils || {};

(function () {
	'use strict';

	var currying = function (fn) {
		var slice = Array.prototype.slice,
			stored_args = slice.call(arguments, 1);

		return function () {
			var new_args = slice.call(arguments),
				args = stored_args.concat(new_args);
			return fn.apply(null, args);
		};
	};

	if (typeof window === 'undefined') {
		module.exports = currying;
	} else {
		SOG.utils.currying = currying;
	}
}());
;/*jslint browser: true */

var SOG = SOG || {};
SOG.utils = SOG.utils || {};

SOG.utils.html = function (type, attributes) {
	'use strict';

	var n = document.createElement(type),
		as = attributes || {};
	// Append to parent
	if (as.to) {
		as.to.appendChild(n);
		delete as.to;
	}
	// Text
	if (as.text) {
		n.innerHTML = as.text;
		delete as.text;
	}
	// Href
	if (type === 'a' && !as.href) { n.setAttribute('href', '#'); }
	// Other attributes
	Object.keys(as).forEach(function (a) { n.setAttribute(a, as[a]); });

	return n;
};
;/*jslint bitwise: true, nomen: true, white: true */
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
;/*jslint bitwise: true, nomen: true, white: true */
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
;/*jslint bitwise: true, nomen: true, white: true */
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
;(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['facebook.hbs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div id=\"fb-user-data\">\n  <img src=\"";
  if (stack1 = helpers.picture) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.picture; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" alt=\"Bild på ";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n  <h1>";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h1>\n</div>\n<div id=\"fb-user-btns\">\n  <a href=\"#\" id=\"fb-signout-button\">Logga ut</a>\n</div>\n";
  return buffer;
  });
})();;(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['popup.hbs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var stack1;
  if (stack1 = helpers.message) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.message; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  return escapeExpression(stack1);
  }

function program3(depth0,data) {
  
  var stack1;
  if (stack1 = helpers.message) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.message; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }

function program5(depth0,data) {
  
  var stack1;
  if (stack1 = helpers.extra) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.extra; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  return escapeExpression(stack1);
  }

function program7(depth0,data) {
  
  var stack1;
  if (stack1 = helpers.extra) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.extra; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }

  buffer += "<div id=\"popup\">\n  <div class=\"title\">";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>\n  <div class=\"message\">";
  stack1 = helpers['if'].call(depth0, depth0.escape, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</div>\n  <div class=\"extra\">";
  stack1 = helpers['if'].call(depth0, depth0.escape, {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</div>\n</div>\n";
  return buffer;
  });
})();;(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['player.hbs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  
  return " you";
  }

  buffer += "<div class=\"player";
  stack1 = helpers['if'].call(depth0, depth0.you, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" id=\"player-";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n  <img src=\"";
  if (stack1 = helpers.picture) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.picture; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" alt=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n  <div class=\"information\">\n    <span class=\"name\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n    <span class=\"points\">";
  if (stack1 = helpers.points) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.points; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " poäng</span>\n  </div>\n</div>\n";
  return buffer;
  });
})();;(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['room.hbs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div id=\"chat-container\">\n  <div id=\"game-user-info\">\n    <div class=\"players\">\n    </div>\n  </div>\n\n  <div id=\"chat\">\n    <div id=\"chat-messages\"></div>\n    <div id=\"chat-input\">\n      <img src=\"";
  if (stack1 = helpers.picture) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.picture; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n      <input type=\"text\" placeholder=\"Gissa på ett ord..\" autofocus>\n    </div>\n  </div>\n  <div id=\"crayons\">\n    <h1>KRITA</h1>\n    <ul id=\"sizes\">\n      <li class=\"size-5\"><a href=\"#\" data-size=\"5\"></a></li>\n      <li class=\"size-10\"><a href=\"#\" data-size=\"10\"></a></li>\n      <li class=\"size-15\"><a href=\"#\" data-size=\"15\"></a></li>\n      <li class=\"size-20\"><a href=\"#\" data-size=\"20\"></a></li>\n    </ul>\n    <h1>FÄRG</h1>\n    <ul id=\"colors\">\n      <li class=\"white\"><a href=\"#\" data-color=\"white\"></a></li>\n      <li class=\"black\"><a href=\"#\" data-color=\"black\"></a></li>\n      <li class=\"red\"><a href=\"#\" data-color=\"red\"></a></li>\n      <li class=\"orange\"><a href=\"#\" data-color=\"orange\"></a></li>\n      <li class=\"yellow\"><a href=\"#\" data-color=\"yellow\"></a></li>\n      <li class=\"yellowgreen\"><a href=\"#\" data-color=\"yellowgreen\"></a></li>\n      <li class=\"green\"><a href=\"#\" data-color=\"green\"></a></li>\n      <li class=\"lightskyblue\"><a href=\"#\" data-color=\"lightskyblue\"></a></li>\n      <li class=\"dodgerblue\"><a href=\"#\" data-color=\"dodgerblue\"></a></li>\n      <li class=\"violet\"><a href=\"#\" data-color=\"violet\"></a></li>\n      <li class=\"pink\"><a href=\"#\" data-color=\"pink\"></a></li>\n      <li class=\"burlywood\"><a href=\"#\" data-color=\"burlywood\"></a></li>\n      <li class=\"saddlebrown\"><a href=\"#\" data-color=\"saddlebrown\"></a></li>\n      <li class=\"brown\"><a href=\"#\" data-color=\"brown\"></a></li>\n    </ul>\n  </div>\n</div>\n\n<div id=\"gameplan\">\n  <div id=\"timer\">\n    <div id=\"timer-progress\"></div>\n  </div>\n  <div id=\"artboard-wrapper\">\n    <canvas id=\"artboard\" width=\"800\" height=\"600\"></canvas>\n  </div>\n</div>\n";
  return buffer;
  });
})();;(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['message.hbs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"message";
  if (stack1 = helpers.css) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.css; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n  <img src=\"";
  if (stack1 = helpers.picture) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.picture; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" alt=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n  <p>";
  if (stack1 = helpers.message) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.message; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</p>\n</div>\n";
  return buffer;
  });
})();;(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['servermessage.hbs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"server-message\">\n  # ";
  if (stack1 = helpers.message) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.message; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n</div>\n";
  return buffer;
  });
})();;(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['donemessage.hbs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <a href=\"/p/";
  if (stack1 = helpers.fid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.fid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "/latest\" target=\"_blank\">\n  ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <a href=\"";
  if (stack1 = helpers.url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" download=\"";
  if (stack1 = helpers.word) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.word; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + ".png\" target=\"_blank\">\n  ";
  return buffer;
  }

  buffer += "<div class=\"drawing-done\">\n  <div class=\"word\">";
  if (stack1 = helpers.word) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.word; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>\n  ";
  stack1 = helpers['if'].call(depth0, depth0.fid, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    <img src=\"";
  if (stack1 = helpers.img) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.img; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" alt=\"";
  if (stack1 = helpers.word) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.word; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" style=\"width: 100%\">\n  </a>\n  <img src=\"";
  if (stack1 = helpers.picture) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.picture; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" alt=\"\" class=\"user\" />\n  <div class=\"by\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>\n</div>\n";
  return buffer;
  });
})();;(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['gameover.hbs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <li>\n    <img src=\"";
  if (stack1 = helpers.picture) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.picture; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n    <div class=\"player-info\">\n      <span class=\"name\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n      <span class=\"score\">";
  if (stack1 = helpers.score) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.score; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n    </div>\n  </li>\n  ";
  return buffer;
  }

  buffer += "<h1>Game Over</h1>\n<ul>\n  ";
  stack1 = helpers.each.call(depth0, depth0.players, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ul>\n";
  return buffer;
  });
})();;(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['game.hbs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <div class=\"player\">\n    <img src=\"";
  if (stack1 = helpers.picture) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.picture; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" alt=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n    <div class=\"name\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>\n  </div>\n  ";
  return buffer;
  }

  buffer += "<img src=\"images/";
  if (stack1 = helpers.image) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.image; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" alt=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n<h1>";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h1>\n<p class=\"description\">";
  if (stack1 = helpers.description) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.description; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " Just nu <span class=\"nr-of-players\">";
  if (stack1 = helpers.nrOfPlayers) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.nrOfPlayers; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span> spelare med <span class=\"rounds-left\">";
  if (stack1 = helpers.roundsLeft) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.roundsLeft; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span> rundor kvar att spela.</p>\n<div class=\"players\">\n  ";
  stack1 = helpers.each.call(depth0, depth0.players, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</p>\n";
  return buffer;
  });
})();;/*global io, SOG */

/**
 * @namespace browser
 */
SOG.utils.namespace('SOG.browser.game');

SOG.browser.game = (function () {
	'use strict';

	var socket = io.connect('http://skissaochgissa-klamby.rhcloud.com:8000'),
		strings = {
			'GameNotFoundException': {
				title: 'Spelet hittades inte',
				message: 'Spelet finns inte längre. Du har kanske fått en gammal länk eller inte laddat om sidan på länge.',
				extra: 'Lösning: Det borde fungera att ladda om sidan!'
			},
			'GameIsFullException': {
				title: 'Spelet är fullt',
				message: 'Det får tyvärr inte plats med fler spelare i detta spelet. Det borde finnas fler spel i samma kategori.'
			},
			'DisconnectedException': {
				title: ':(',
				message: 'Anslutningen till servern har brutits. Möjliga anledningar: <ul><li>Jag uppdaterar spelet</li><li>Servern har kraschat</li><li>Du har varit inaktiv väldigt länge</li></ul>',
				extra: 'Vänta ett par minuter och testa sen att ladda om sidan.',
				escape: false,
				closeable: false
			},
			'ScoreMessage': "{gName} fick {gPoints} ponäng efter att ha gissat rätt. {dName} fick {dPoints} poäng för att har ritat så bra."
		};

	return {
		/**
		 * Fired when a error occurs on the server.
		 *
		 * @event onError
		 * @param cb {function}
		 */
		onError: function (cb) {
			socket.on('error-message', cb);
			socket.on('disconnect', cb.curry({ name: 'DisconnectedException' }));
		},

		/**
		 * Fired when game is over.
		 *
		 * @event onGameOver
		 * @param cb {function}
		 */
		onGameOver: function (cb) {
			socket.on('game-over', cb);
		},

		/**
		 * Fired when client connects to websocket.
		 *
		 * @event onConnect
		 * @param cb {function}
		 */
		onConnect: function (cb) {
			socket.on('connect', cb);
		},

		/**
		 * @method getSocket
		 * @return Returns the socket.
		 */
		getSocket: function () { return socket; },

		/**
		 * @method str
		 * @param id {string}
		 * @return Returns the string with that id.
		 */
		str: function (id) { return strings[id]; },

		/**
		 * @method onPoints
		 * @param cb {function} First param is an object with guesser and
		 *                      next is for the drawer (player, points, total).
		 */
		onPoints: function (cb) {
			socket.on('update-points', function (data) {
				cb({
					player: new SOG.browser.Player(data.guess_player),
					points: data.guess_points,
					total: data.guess_total
				}, {
					player: new SOG.browser.Player(data.draw_player),
					points: data.draw_points,
					total: data.draw_total
				});
			});
		}
	};
}());
;/*jslint browser: true */
/*global SOG, Handlebars */

SOG.utils.namespace('SOG.browser.lobby');

SOG.browser.lobby = (function () {
	'use strict';

	var socket, games, addRoom, removeRoom, updateRoom, gameSelected, click;

	click = function (g) {
		return function (e) {
			gameSelected(g);
			e.preventDefault();
		};
	};

	addRoom = function (data) {
		var game, fragment;

		if (data instanceof Array) {
			fragment = document.createDocumentFragment();

			data.forEach(function (d) {
				game = SOG.utils.html('article', {
					'class': 'game ' + d.difficulty,
					'data-name': d.id,
					text: Handlebars.templates['game.hbs'](d),
					to: fragment
				});
				game.addEventListener('click', click(d.id));
				fragment.appendChild(game);
			});

			games.innerHTML = '';
			games.appendChild(fragment);
		} else {
			game = SOG.utils.html('article', {
				'class': 'game ' + data.difficulty,
				'data-name': data.id,
				text: Handlebars.templates['game.hbs'](data),
				to: games
			});
			game.addEventListener('click', click(data.id));
		}
	};

	removeRoom = function (id) {
		games.removeChild(document.querySelector('article[data-name="' + id + '"]'));
	};

	updateRoom = function (id, data) {
		console.log(id);
		console.log(data);
	};

	return {
		init: function (s, g) {
			socket = s;
			games = g;

			socket.on('add-room', addRoom);
			socket.on('remove-room', removeRoom);
			socket.on('update-room', updateRoom);
		},

		onGameSelected: function (cb) {
			gameSelected = cb;
		}
	};
}());
;/*jslint browser: true */
/*global SOG */

/**
 * @namespace browser
 */
SOG.utils.namespace('SOG.browser.Point');

(function () {
	'use strict';

	/**
	 * Represents a Point.
	 *
	 * @class Point
	 * @constructor
	 * @param x {int} The x cordination.
	 * @param y {int} The y cordination.
	 * @param dragging {boolean} True if not the first point.
	 * @param color {string} The color of the point.
	 * @param size {int} The size of the point.
	 */
	SOG.browser.Point = function (x, y, dragging, color, size) {
		/**
		 * @method getX
		 * @return {int} The x cordination.
		 */
		this.getX = function () { return x; };
		/**
		 * @method getY
		 * @return {int} The y cordination.
		 */
		this.getY = function () { return y; };
		/**
		 * @method getColor
		 * @return {string} The color of the point.
		 */
		this.getColor = function () { return color; };
		/**
		 * @method getSize
		 * @return {int} The size of the point.
		 */
		this.getSize = function () { return size; };
		/**
		 * @method getDragging
		 * @return {boolean} True if not the first point.
		 */
		this.getDragging = function () { return dragging; };
	};

	/**
	 * Get all data about the point.
	 *
	 * @method data
	 * @return {Object} Returns a object with all data (x, y, color, size, dragging).
	 */
	SOG.browser.Point.prototype.data = function () {
		return {
			x: this.getX(),
			y: this.getY(),
			color: this.getColor(),
			size: this.getSize(),
			dragging: this.getDragging()
		}
	};
}());
;/*jslint browser: true */
/*global SOG */

/**
 * @namespace browser
 */
SOG.utils.namespace('SOG.browser.points');

/**
 * Represents all points for an image. Uses
 * {{#crossLink "browser.Point"}}Point{{/crossLink}}.
 *
 * @class points
 * @static
 */
SOG.browser.points = (function (Point) {
	'use strict';

	var color = '#df4b26',
		size = 5,
		points = [],
		forEach = function (fn, a) { a.forEach(fn); }, // TODO Move to utils.funtional, kanske?
		add = function (x, y, dragging) {
			var p;
			if (x instanceof Object) {
				p = new Point(x.x, x.y, !!x.dragging, x.color, x.size);
			} else {
				p = new Point(x, y, !!dragging, color, size);
			}
			points.push(p);
			return p;
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

		addArray: forEach.curry(add),

		// TODO Delete this.
		test: function () { return points; },

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
			var i, previous, current;
			for (i = 0; i < points.length; i += 1) {
				previous = points[i - 1] && points[i - 1].data();
				current = points[i].data();
				fn(previous, current);
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
			var i = points.length - 1,
				previous = points[i - 1] && points[i - 1].data(),
				current = points[i].data();
			fn(previous, current);
		}
	};
}(SOG.browser.Point));
;/*jslint browser: true */
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
			// Change cursor
			this.setColor('red');
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
		},

		/**
		 * Set color and crayon.
		 *
		 * @method setColor
		 * @param c {string} The color.
		 */
		setColor: points.setColor.compose(changeCrayon),

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
;/*global window, exports, SOG */

/**
 * @namespace shared
 */

(function () {
  'use strict';

  /**
   * Represents a player.
   *
   * @class Player
   * @constructor
   * @param data {object} Information about the player, from Facebook for
   *                      example.
   */
  var Player = function (data) {
    /**
     * @method getAllData
     * @return Returns all data on player.
     */
    this.getAllData = function () { return data; };

    /**
     * @method getSocketID
     * @return Returns the id from socket.
     */
    this.getSocketID = function () { return data.socket; };

    /**
     * @method setSocketID
     * @param id {int} The socket id.
     */
    this.setSocketID = function (id) { data.socket = id; };

    /**
     * @method getName
     * @return Returns the full name.
     */
    this.getName = function () { return data.name; };
    this.getFullName = this.getName; // TODO Remove

    /**
     * @method setFullName
     * @param name {string} The full name.
     */
    this.setFullName = function (name) { data.name = name; };

    /**
     * @method getFacebookID
     * @return Returns the id from Facebook.
     */
    this.getFacebookID = function () { return data.id; };

    /**
     * @method getFirstName
     * @return Returns the first name.
     */
    this.getFirstName = function () { return data.first_name; };

    /**
     * @method getPicture
     * @return Returns the url to the picture.
     */
    this.getPicture = function () {
      return (data.picture && data.picture.data.url) || 'gfx/nopic50.png';
    };

    /**
     * @method getFriends
     * @return Returns the players all friends.
     */
    this.getFriends = function () { return data.friends.data; };

    /**
     * @method getFacebookUsername
     * @return Returns the username from Facebook.
     */
    this.getFacebookUsername = function () { return data.username; };

    /**
     * @method getFacebookLink
     * @return Returns the url to the personal Facebook-page.
     */
    this.getFacebookLink = function () { return data.link; };

    /**
     * Replace the old data with the new data.
     *
     * @method updateData
     * @param d {object} New data.
     */
    this.updateData = function (d) { data = d; };

    var pnts = 0;
    /**
     * @method points
     * @param points {int} Optional. Points to add or 0 to clear.
     * @return Returns points.
     */
    this.points = function (p) {
      pnts = (p === 0) ? 0 : pnts + (p || 0);
      return pnts;
    };
  };

  /**
   * Get values from the player in a object.
   *
   * @method getObject
   * @param fields {array}
   * @param callback {function}
   * @return Returns a object with specified data plus object returned from
   *         callback.
   */
  Player.prototype.getObject = function (fields, callback) {
    var o = {}, self = this;
    fields.forEach(function (key) {
      o[key] = self['get' + key.capitalize()]();
    });
    return callback ? Object.merge(o, callback(this)) : o;
  };

  /**
   * Get specific data from all friends.
   *
   * @method listFriends
   * @param field {string} The type of information (for example 'name').
   * @return Returns an array with specified data.
   */
  Player.prototype.listFriends = function (field) {
    // Return specific data on every user
    return this.getFriends().map(function (f) { return f[field || 'id']; });
  };

  /**
   * Get friends from a array with ids.
   *
   * @method getFriendsFromIds
   * @param ids {array} The array with friends Facebook IDs.
   * @return Returns en array with all Friends in the ids-array.
   */
  Player.prototype.getFriendsFromIds = function (ids) {
    // Return all friends in param
    return this.getFriends().filter(function (f) { return ids.indexOf(f.id) !== -1; });
  };

  if (typeof window === 'undefined') {
    exports.Player = Player;
  } else {
    SOG.utils.namespace('SOG.shared.Player');
    SOG.shared.Player = Player;
  }
}());
;/*jslint browser: true */
/*global mediator, SOG */

/**
 * @namespace browser
 */
SOG.utils.namespace('SOG.browser.Player');

(function () {
	'use strict';

	/**
	 * Represents a Player.
	 *
	 * @class Player
	 * @extends shared.Player
	 * @constructor
	 * @param data {object} All player data. From Facebook for example.
	 */
	var Player = function (data) {
		SOG.shared.Player.call(this, data);
	};

	Player.prototype = Object.create(SOG.shared.Player.prototype);

	/**
	 * Join a socket room.
	 *
	 * @method join
	 * @param socket {object} The Socket.io-socket.
	 */
	Player.prototype.join = function (socket) {
		var self = this;

		// Save room
		this.room = socket.get('socket');

		// Send user to server
		this.room.on('identify-player', function (data) {
			self.setSocketID(data.id);
			self.room.emit('identify-player', self.getAllData());
		});
	};

	/**
	 * Send message to other players in room.
	 *
	 * @method sendMessage
	 * @param msg {string} The message to be sent.
	 */
	Player.prototype.sendMessage = function (msg) {
		this.room.emit('user-message', msg);
	};

	/**
	 * Fired when server sends Player data.
	 *
	 * @event onDataChanged
	 * @param fn {function} Function with this as param.
	 */
	Player.prototype.onDataChanged = function (fn) {
		var self = this;
		this.room.on('update-player-data', function () {
			fn(self);
		});
	};

	/**
	 * Send new Player data to server.
	 *
	 * @method updateData
	 * @param data {object} The data to send to the server.
	 */
	Player.prototype.updateData = function (data) {
		//this.room.emit('update-player-data', data);
		SOG.shared.Player.prototype.updateData.call(this, data);
	};

	/**
	 * Send new Player data to server.
	 *
	 * @method updateDataSkit
	 * @param data {object} The data to send to the server.
	 */
	Player.prototype.updateDataSkit = function (data) {
		var d = Object.merge(data, { socket: this.getSocketID() });
		this.room.emit('identify-player', d);
		this.updateData(d);
	};

	/**
	 * Send image to server in base64-format.
	 *
	 * @method saveImage
	 * @param image {string} Image in base64-format.
	 */
	Player.prototype.saveImage = function (image) {
		this.room.emit('save-image', image);
	};

	SOG.browser.Player = Player;
}());
;/*global window, module, SOG */

/**
 * @namespace shared
 */

(function () {
	'use strict';

	/**
	 * Represents a room.
	 *
	 * @class Room
	 * @constructor
	 * @param options {object} Options for the room.
	 */
	var Room = function (options) {
		/**
		 * Getter
		 *
		 * @method get
		 * @param key {string} The room-option you want back.
		 * @return Returns the specified data.
		 */
		this.get = function (key) { return options[key]; };

		/**
		 * Setter
		 *
		 * @method set
		 * @param key {string} The key.
		 * @param value {string|object|int} The new value.
		 */
		this.set = function (key, value) { options[key] = value; };
	};

	if (typeof window === 'undefined') {
		module.exports = Room;
	} else {
		SOG.utils.namespace('SOG.shared.Room');
		SOG.shared.Room = Room;
	}
}());
;/*global io, SOG */

/**
 * @namespace browser
 */
SOG.utils.namespace('SOG.browser.Room');

(function () {
	'use strict';

	/**
	 * Represents a Room.
	 *
	 * @class Room
	 * @extends shared.Room
	 * @constructor
	 * @param options {object} Room options.
	 */
	SOG.browser.Room = function (options) {
		SOG.shared.Room.call(this, options);
		this.set('socket', options.socket);
	};

	SOG.browser.Room.prototype = Object.create(SOG.shared.Room.prototype);

	/**
	 * Fired when player joins the room.
	 *
	 * @event onPlayerJoinsRoom
	 * @param fn {function} The callback function. Param: player, data.
	 */
	SOG.browser.Room.prototype.onPlayerJoinsRoom = function (fn) {
		this.get('socket').on('player-joined-room', function (data) {
			var player = new SOG.browser.Player(data.player);
			fn(player, data);
		});
	};

	/**
	 * Fired when a new user-message is sent from the server.
	 *
	 * @event onUserMessage
	 * @param fn {function} The callback function that takes parameters player,
	 *                      text and all data.
	 */
	SOG.browser.Room.prototype.onUserMessage = function (fn) {
		this.get('socket').on('user-message', function (data) {
			var player = new SOG.browser.Player(data.player);
			fn(player, data.text, data);
		});
	};

	/**
	 * Fired when a new server-message is sent from the server.
	 *
	 * @event onServerMessage
	 * @param fn {function} The callback function that takes parameters type
	 *                      and text.
	 */
	SOG.browser.Room.prototype.onServerMessage = function (fn) {
		this.get('socket').on('server-message', function (data) {
			fn(data.type || '', data.text);
		});
	};

	/**
	 * Send points to server.
	 *
	 * @method sendPoints
	 * @param point {object} The point. TODO See if param really is a object.
	 */
	SOG.browser.Room.prototype.sendPoints = function (point) {
		this.get('socket').emit('canvas', point);
	};

	/**
	 * Fired when a point is received from server.
	 *
	 * @event onReceivePoint
	 * @param fn {function} Callback function.
	 */
	SOG.browser.Room.prototype.onReceivePoint = function (fn) {
		this.get('socket').on('canvas', fn);
	};

	/**
	 * Fired when correct word is guessed.
	 *
	 * @event onCorrectWordGuessed
	 * @param fn {function} Callback function. With a object as param (TODO Keys?).
	 */
	SOG.browser.Room.prototype.onCorrectWordGuessed = function (fn) {
		this.get('socket').on('correct-word', function (data) {
			data.next.player = new SOG.browser.Player(data.next.player);
			data.player = new SOG.browser.Player(data.player);
			fn(data);
		});
	};

	SOG.browser.Room.prototype.onLeaveRoom = function (cb) {
		this.get('socket').on('leave-room', function (data) {
			cb(data.name, data.id);
		});
	};

	/**
	 * Change room.
	 *
	 * @method changeTo
	 * @param roomId {string}
	 * @param cb {function}
	 */
	SOG.browser.Room.prototype.changeTo = function (room, cb) {
		// Ask to join room
		this.get('socket').emit('join-room', room);
		// Take care of response
		this.get('socket').on('join-room', function (data) {
			data.players = data.players.map(function (p) {
				return new SOG.browser.Player(p);
			});
			cb(data);
		});
	};
}());
;/*jslint browser: true */
/*global Handlebars, SOG */

/**
 * @namespace browser
 */
SOG.utils.namespace('SOG.browser.popup');

SOG.browser.popup = (function () {
	'use strict';

	var popupTempl = Handlebars.templates['popup.hbs'],
		wrapper = SOG.utils.html('div', { id: 'popup-wrapper' }),
		page = document.getElementById('page-wrapper'),
		popup,
		closePopup,
		createPopup,
		createSimplePopup,
		btnWrapper,
		addBtn;

	closePopup = function (e) {
		wrapper.classList.remove('show');
		setTimeout(function () { document.body.removeChild(wrapper); }, 500);
		page.classList.remove('blur');
		if (e && e.preventDefault) { e.preventDefault(); }
		wrapper.removeEventListener('click', closePopup);
	};

	createPopup = function (options) {
		// Set escape to true if its undefined
		if (typeof options.escape === 'undefined') {
			options.escape = true;
		}

		// Close by clicking on the background
		if (options.closeable || typeof options.closeable === 'undefined') {
			wrapper.classList.remove('not-closeable');
			wrapper.addEventListener('click', closePopup);
		} else {
			wrapper.classList.add('not-closeable');
		}

		// Blur the page
		page.classList.add('blur');

		// Add the popup to the DOM
		wrapper.innerHTML = popupTempl(options);
		document.body.appendChild(wrapper);

		// The popup div
		popup = document.getElementById('popup');

		// Dont close popup when clicking on it
		popup.addEventListener('click',  function (e) {
			e.preventDefault();
			e.stopPropagation();
		});

		// Center popup vertically
		popup.style.marginTop = ((window.innerHeight - popup.offsetHeight) / 2) + 'px';

		// Show the popup
		setTimeout(function () { wrapper.classList.add('show'); }, 10);

	};

	createSimplePopup = function (options) {
		var msg = options.message || options,
			wrapper = SOG.utils.html('div', {
				id: 'simple-popup-message-wrapper',
				to: document.body
			}),
			message = SOG.utils.html('div', {
				'class': 'simple-popup-message',
				text: msg,
				to: wrapper
			});

		setTimeout(function () { document.body.removeChild(wrapper); }, 10000);

		return wrapper;
	};

	addBtn = function (text, cb, classname) {
		if (!btnWrapper) {
			btnWrapper = SOG.utils.html('div', { 'class': 'buttons', to: popup });
		}

		var btn = SOG.utils.html('a', {
			'class': classname || 'ok-btn',
			text: text,
			to: btnWrapper
		});

		if (typeof cb === 'string') {
			btn.setAttribute('href', cb);
		} else {
			btn.addEventListener('click', function (e) {
				cb();
				e.preventDefault();
			});
		}
	};

	return function (options, type) {
		if (type === 'simple') {
			return createSimplePopup(options);
		}

		createPopup(options);
		return {
			close: closePopup,
			addBtn: addBtn
		};
	};
}());
;/*global Handlebars */
/*global SOG */

SOG.utils.namespace('SOG.browser.chat');

SOG.browser.chat = (function () {
	'use strict';

	var inputField, messages, thisPlayer,
		messageTemplate = Handlebars.templates['message.hbs'],
		serverMessageTemplate = Handlebars.templates['servermessage.hbs'],
		doneMessageTemplate = Handlebars.templates['donemessage.hbs'];

	return {
		init: function (o) {
			// Store options
			inputField = o.input;
			messages = o.messages;
			thisPlayer = o.player;

			// Add event on input field
			inputField.addEventListener('keypress', function (e) {
				if (e.keyCode === 13 && !this.value.isBlank()) {
					thisPlayer.sendMessage(this.value);
					this.value = '';
					e.preventDefault();
				}
			});
		},

		createMessage: function (from, message, options) {
			var html;

			if (typeof from.img === 'string') {
				html = doneMessageTemplate(from);
			} else if (typeof from === 'string' || from instanceof String) {
				html = serverMessageTemplate({ message: message });
			} else {
				html = messageTemplate({
					name: from.getFullName(),
					picture: from.getPicture(),
					message: message,
					css: (options.win) ? ' win' : ''
				});
			}

			messages.innerHTML = html + messages.innerHTML;
		}
	}
}());
;/*global SOG */

/**
 * @namespace browser
 * @requires SOG.utils.currying, SOG.browser.artboard
 */
SOG.utils.namespace('SOG.browser.crayons');

/**
 * Make size and color buttons work. Uses
 * {{#crossLink "browser.artboard/setColor:method"}}setColor{{/crossLink}} and
 * {{#crossLink "browser.artboard/setSize:method"}}setSize{{/crossLink}}
 * from SOG.browser.artboard.
 *
 * @class crayons
 * @static
 */
SOG.browser.crayons = (function (currying) {
	'use strict';

	var change, size, color;

	/**
	 * Call appropriate browser.artboard function.
	 *
	 * @method change
	 * @private
	 * @param type {string} Color or size.
	 * @param e {object} Event.
	 */
	change = (function () {
		var last = {};
		return function (type, e) {
			var self = e.target || e;

			// Shift selected-class
			if (typeof last[type] !== 'undefined') {
				last[type].classList.remove('selected');
			}
			last[type] = self;
			self.classList.add('selected');
			// Change color or size
			SOG.browser.artboard['set' + type.capitalize()](self.getAttribute('data-' + type));
			if (e.preventDefault) { e.preventDefault(); }
		};
	}());

	color = change.curry('color');
	size = change.curry('size');

	return {
		/**
		 * Init
		 *
		 * @method init
		 * @param dom {object} Array with node for colors and node for sizes.
		 * @example
		 *     browser.crayons.init({
		 *         colors: [node, node],
		 *         sizes: [node, node]
		 *     });
		 */
		init: function (dom) {
			// Select default
			color(dom.colors[2]);
			size(dom.sizes[0]);
			// Add event listeners
			dom.sizes.forEach(function (s) { s.addEventListener('click', size); });
			dom.colors.forEach(function (c) { c.addEventListener('click', color); });
		}
	}
}(SOG.utils.currying));
;/*jslint browser: true, devel: true */
/*global SOG, FB, Handlebars */

// Default player name
SOG.player = new SOG.browser.Player({ name: 'Anonym (' + Date.now() + ')' });

function signedIn() {
	'use strict';
	console.log('inloggad');
	FB.api('/me?fields=id,name,first_name,username,picture,link,friends.fields(id,name,picture)', function (d) {
		// Save user data
		SOG.player.updateDataSkit(d);
		// Change on the page
		var facebook_div = document.querySelector('#facebook'),
			template = Handlebars.templates['facebook.hbs'],
			html = template({ name: SOG.player.getFullName(), picture: SOG.player.getPicture() });
		facebook_div.innerHTML = html;
	});
}

function login() {
	'use strict';
	var btn = document.querySelector('#fb-login-button');
	btn.addEventListener('click', function (e) {
		e.preventDefault();
		FB.login(function (res) {
			if (res.authResponse) {
				signedIn();
			}
		});
	});
}

function logout() {
	'use strict';
	FB.logout(function () {
		console.log('bye');
	});
}

window.fbAsyncInit = function () {
	'use strict';
	console.log('fbAsyncInit');
	FB.init({
		appId      : '539892936062898', //App ID
		//appId      : '614840228526917', //App ID
		channelUrl : '//localhost:3000/channel.html', // Channel File
		status     : true, // Check login status
		cookie     : true, // Enable cookies to allow the server to access the session
		xfbml      : true // Parse XFBML
	});
	// Additional init code here
	FB.getLoginStatus(function (response) {
		if (response.status === 'connected') {
			// Inloggad
			console.log('signed in');
			signedIn();
		} else {
			console.log('log in');
			login();
		}
	});
};

(function (d) {
	'use strict';

	var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
	if (d.getElementById(id)) { return; }
	js = d.createElement('script');
	js.id = id;
	js.async = true;
	js.src = "//connect.facebook.net/en_US/all.js";
	ref.parentNode.insertBefore(js, ref);
}(document));

window.onload = function () {
	'use strict';

	var game = SOG.browser.game,
		room = new SOG.browser.Room({ id: 'room', name: 'Lobby', socket: game.getSocket() }),
		gamesList = [].slice.call(document.querySelectorAll('#games .game')),
		wordNode,
		startGame,
		showErrorMessage,
		pageWrapper = document.getElementById('page-wrapper'),
		gameWrapper = document.getElementById('game-wrapper');

	// Init lobby
	SOG.browser.lobby.init(game.getSocket(), document.getElementById('games'));

	// Start game
	startGame = function (data) {
		// Html for game
		gameWrapper.innerHTML = Handlebars.templates['room.hbs']({ picture: SOG.player.getPicture() });

		var gameplan = document.getElementById('gameplan'),
			chatInputField = document.querySelector('#chat-input input'),
			chatMessages = document.getElementById('chat-messages'),
			playersList = document.querySelector('#game-user-info .players'),
			timer = document.getElementById('timer-progress'),
			artboardWrapper = document.getElementById('artboard-wrapper'),
			playerTmpl = Handlebars.templates['player.hbs'],
			chat = SOG.browser.chat,
			artboard = SOG.browser.artboard,
			addPlayerToList,
			drawingPlayer;

		// Add player to list
		addPlayerToList = function (p, data) {
			var you = p.getSocketID() === SOG.player.getSocketID();
			// Show message in chat
			if (!you) { chat.createMessage('', p.getName() + ' har gått med i spelet!'); }
			// Add player to player-list
			playersList.innerHTML += playerTmpl(p.getObject(['name', 'picture'], function () {
				return { points: p.points(), you: you, id: p.getSocketID() };
			}));
		};

		// Init chat
		chat.init({ input: chatInputField, messages: chatMessages, player: SOG.player });

		// Add current players to list
		data.players.forEach(addPlayerToList);

		// Show messages in chat sent by users
		room.onUserMessage(chat.createMessage);

		// Show messages in chat sent by server
		room.onServerMessage(chat.createMessage);

		// Init artboard
		artboard.init({
			canvas: document.querySelector('#artboard'),
			x: gameplan.offsetLeft + 5,
			y: gameplan.offsetTop + 5,
			room: room
		});

		// New points
		game.onPoints(function (guesser, drawer) {
			// Show a message in the chat
			chat.createMessage('', game.str('ScoreMessage').assign({
				gName: guesser.player.getName(),
				gPoints: guesser.points,
				dName: drawer.player.getName(),
				dPoints: drawer.points
			}));
			// Update scores
			// TODO Make nicer
			document.querySelector('#player-' + guesser.player.getSocketID() + ' .points').innerHTML = guesser.total + ' poäng';
			document.querySelector('#player-' + drawer.player.getSocketID() + ' .points').innerHTML = drawer.total + ' poäng';
		});

		// Correct word
		room.onCorrectWordGuessed(function (data) {
			// Remove old word
			if (typeof wordNode !== 'undefined') {
				gameplan.removeChild(wordNode);
				wordNode = undefined;
				gameWrapper.classList.remove('draw');
				chatInputField.disabled = false;
			}

			if (data.next && data.next.draw) {
				// Disable chat input field
				chatInputField.disabled = true;
				// Show new word
				wordNode = SOG.utils.html('div', {
					id: 'word-wrapper',
					text: '<div id="word"><span class="text">Din tur att rita</span><span class="word">' + data.next.word + '</span>',
					to: gameplan
				});
				setTimeout(function () {
					// Minimize word
					wordNode.classList.add('small');

					// Show crayons
					gameWrapper.classList.add('draw');
				}, 2000);
				// Enable drawing
				artboard.enable();
			} else {
				window.setTimeout(function () {
					chatInputField.focus(); // TODO Whats wrong?
				}, 0);
				// Disable drawing
				artboard.disable();
			}

			// Save drawing in chat
			if (data.word !== '' && artboard.getImage() !== '') {
				SOG.player.saveImage(artboard.getImage());

				chat.createMessage({
					img: artboard.getImage(),
					word: data.word,
					name: data.player.getName(),
					picture: data.player.getPicture(),
					fid: data.player.getFacebookID()
				});
			}

			// Clear the artboard
			artboard.clear();

			// Start timer
			timer.className = '';
			setTimeout(function () { timer.classList.add('min-' + (data.next.minutes || 0)); }, 2000);

			// Show who is drawing
			if (drawingPlayer) {
				artboardWrapper.removeChild(drawingPlayer);
				drawingPlayer = undefined;
			}
			if (data.next.player) {
				drawingPlayer = SOG.utils.html('div', {
					id: 'drawing-player',
					text: '<img src="' + data.next.player.getPicture() + '"><span>' + data.next.player.getName() + ' ritar.</span>',
					to: artboardWrapper
				});
			}

			// When someone leave
			room.onLeaveRoom(function (name, id) {
				playersList.removeChild(document.getElementById('player-' + id));
				chat.createMessage('', name + ' har lämnat spelet.');
			});

			// Game over!
			game.onGameOver(function (data) {
				SOG.utils.html('div', {
					id: 'game-over-wrapper',
					text: Handlebars.templates['gameover.hbs']({ players: data }),
					to: gameplan
				});
			});
		});

		// A player joins the room
		room.onPlayerJoinsRoom(addPlayerToList);

		// Panel for crayon
		SOG.browser.crayons.init({
			sizes: [].slice.call(document.querySelectorAll('#sizes a')),
			colors: [].slice.call(document.querySelectorAll('#colors a'))
		});
	};

	// Show error message
	showErrorMessage = function (message) {
		console.log('An error occured: ' + message);
	};

	// Join room
	SOG.player.join(room);

	SOG.player.onDataChanged(function (p) {
		console.log(p);
	});

	// Change room
	SOG.browser.lobby.onGameSelected(function (gid) {
		room.changeTo(gid, startGame);
		document.body.classList.add('game');
	});

	// Show error messages on error
	game.onError(function (e) {
		var p = SOG.browser.popup(game.str(e.name) || { title: e.name, message: e.message });

		if (e.name === 'DisconnectedException') {
			// Change to first page
			pageWrapper.classList.remove('hide-wrapper');
			gameWrapper.classList.add('hide-wrapper');
			// Add button when connected again
			game.onConnect(function () {
				p.addBtn('Ok, anslut igen!', 'http://skissaochgissa.se');
			});
		}
	});



	window.tt = SOG.player;
};
