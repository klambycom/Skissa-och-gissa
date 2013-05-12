// From http://dailyjs.com/2012/09/14/functional-programming/
// TODO Do it better!

/**
 * Composite a new function of two functions.
 *
 * @method composite
 * @example
 *     var greet = function (s) { return 'hi, ' + s; },
 *         exclaim = function (s) { return s + '!'; },
 *         excited_greeting = greet.composite(exclaim);
 *     excited_greeting('Pickman'); //=> hi, Pickman!
 */
Function.prototype.composite = function (g) {
	'use strict';

	// preserve f
	var f = this;
	// construct function z
	return function () {
		var args = Array.prototype.slice.call(arguments);
		// when called, nest g's return in a call to f
		return f.call(this, g.apply(this, args));
	};
};

/**
 * Partial Application (aka currying).
 *
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
 *
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