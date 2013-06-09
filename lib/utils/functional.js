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
