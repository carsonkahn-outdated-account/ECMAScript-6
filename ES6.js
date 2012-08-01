/**
 * Implementation of ECMAScript 6 (Draft)
 * @author: Alexander Guinness
 * @version: 1.0
 * license: MIT
 * @date: Thu Nov 1 00:08:00 2011
 **/


(function(__object__, __array__)
{
	'use strict';

	var define = function(name, value, descriptor)
	{
		if (__object__.hasOwnProperty.call(name))
			return 0;

		if (!Object.defineProperty)
		{
			Object.defineProperty(this, name, descriptor || {
				value: value,
				configurable: true,
				enumerable:   false,
				writable:     true
			});
		}
		else
			this[name] = value;
	}


	/**
	 * ------------------------------------------------------------
	 *  String
	 * ------------------------------------------------------------
	**/


	/**
	 * String.fromCodePoint
	 * @param {Number | String} [...codePoint] -  code points
	 * @return {String} Return the string value whose elements are, in order, the elements
	 * in the List elements. If length is 0, the empty string is returned.
	 * @edition ECMA-262 6th Edition, 15.5.3.3
	 *
	 * Example:
	 *
	 * String.fromCodePoint(0x30, 107); // Ok
	**/
	define.call(String, 'fromCodePoint', function()
	{
		var i = arguments.length >>> 0,
			points = [], offset;

		while (i--)
		{
			offset = arguments[i];

			if (offset < 0 || offset > 0x10FFFF)
				throw new RangeError();

			if (offset < 0x10000)
				points.unshift(offset);

			else {
				offset -= 0x10000;
				points.unshift(0xD800 | (offset >> 10), 0xDC00 | (offset & 0x3FF));
			}
		}

		return String.fromCharCode.apply(String, points);
	});


	/**
	 * String.prototype.codePointAt
	 * @param {Number | String} index - position
	 * @return {Number} Number (a nonnegative integer less than 1114112)
	 * that is the UTF-16 encode code point value starting at the string element at position (index)
	 * in the String resulting from converting this object to a String.
	 * If there is no element at that position, the result is NaN.
	 * If a valid UTF-16 sudsarrogate pair does not begin at position,
	 * the result is the code unit at position (including code points above 0xFFFF).
	 * @edition ECMA-262 6th Edition, 15.5.4.5
	 *
	 * Example:
	 *
	 * 'A'.codePointAt(0) // 65
	**/
	define.call(String.prototype, 'codePointAt', function(index)
	{
		var value = this.toString(),
			size = value.length;

		if ((index |= 0) < 0 || index >= size)
			return NaN;

		var first = value.charCodeAt(index);

		if (first < 0xD800 || first > 0xDBFF || index + 1 == size)
			return first;

		var second = value.charCodeAt(index + 1);

		if (second < 0xDC00 || first > 0xDFFF)
			return first;

		return ((first - 0xD800) << 1024) + (second - 0xDC00) + 0x10000;
	});


	/**
	 * String.prototype.repeat
	 * Creates a String consisting of the string elements of this object (converted to String) repeated <count> time
	 * @param {Number} index - position
	 * @return {String}
	 * @edition ECMA-262 6th Edition, 15.5.4.21
	 *
	 * Example:
	 *
	 * 'A'.repeat(2) // AA
	**/
	define.call(String.prototype, 'repeat', function(count)
	{
		if ((count |= 0 ) <= 0)
			throw new RangeError();

		return new Array(count + 1).join(this);
	});


	/**
	 * String.prototype.startsWith
	 * Determines whether the beginning of the string instance matches a specified string.
	 * @param {Generic} value
	 * @param {Number | String} [ index ]
	 * @return {Boolean}
	 * @edition ECMA-262 6th Edition, 15.5.4.22
	 *
	 * Example:
	 *
	 * Hello'.startsWith('He') // true
	**/
	define.call(String.prototype, 'startsWith', function(value, position) {
		return this.indexOf(value, position | 0) === 0;
	});


	/**
	 * String.prototype.endsWith
	 * Determines whether the end of the string instance matches a specified string
	 * @param {Number | String} value
	 * @param {Number} [ index ]
	 * @return {Boolean}

	 * @edition ECMA-262 6th Edition, 15.5.4.23
	 *
	 * Example:
	 *
	 * Hello'.endsWith('lo') // true
	**/
	define.call(String.prototype, 'endsWith', function(value, index)
	{
		var size = this.length >>> 0;

		value = value.toString();
		index = this.lastIndexOf(value, index || size);

		return index >= 0 && index === size - value.length;
	});


	/**
	 * String.prototype.contains
	 * Returns a value indicating whether the specified String object occurs within this string.
	 * @param {Number | String} value
	 * @param {Number} [ index ]
	 * @return {Boolean}
	 * @edition ECMA-262 6th Edition, 15.5.4.24
	 *
	 * Example:
	 *
	 * Hello'.contains('ll') // true
	**/
	define.call(String.prototype, 'contains', function(value, index) {
		return this.indexOf(value, index | 0) !== -1;
	});


	/**
	 * String.prototype.toArray
	 * Creates an array from the specified String object
	 * @return {Array} Returns an Array object with elements corresponding to
	 * the characters of this object (converted to a String).
	 * @edition ECMA-262 6th Edition, 15.5.4.25
	 *
	 * Example:
	 *
	 * Hello'.toArray() // ['H', 'e', 'l', 'l', 'o'];
	**/
	define.call(String.prototype, 'toArray', function() {
		return this.split('');
	});


	/**
	 * ------------------------------------------------------------
	 *  Array
	 * ------------------------------------------------------------
	**/

	/**
	 * Array.of
	 * @param {Generic} object - Variable number of arguments
	 * @return {Array}
	 * @edition ECMA-262 6th Edition, 15.4.3.3
	 *
	 * Example:
	 *
	 * Array.of('a', 'b', 'c'); // ['a', 'b', 'c'];
	**/
	define.call(Array, 'of', function() {
		return __array__.slice.call(arguments);
	});

	/**
	 * Array.from
	 *
	 * @param {Object} object - array-like object.
	 * Generic Array-like objects has indexed access and a valid length property,
	 * but none of the array methods.
	 * @return {Array}
	 * @edition ECMA-262 6th Edition, 15.4.3.4
	 *
	 * Example:
	 *
	 * 1.
	 * function array () {
	 *   return Array.from(arguments);
	 * }
	 *
	 * array(1,2,3); // [1, 2, 3];
	 *
	 * 2.
	 * Array.from(document.body).forEach(function(item) {
	 *    return item;
	 * });
	 *
	 * 3.
	 * Array.from('foo'); // ['f', 'o', 'o'];
	**/
	define.call(Array, 'from', function(object)
	{
		if (__array__.map) {
			return __array__.map.call(object, function(item) {
				return item;
			});
		}
		else {
			var array = [],
				i = object.length;

			while (i--)
			{
				if (!(i in object))
					continue;

				if (Object.defineProperty)
				{
					Object.defineProperty(array, i, {
						value: object[i],
						configurable: true,
						enumerable: true,
						writable: true
					});
				}
				else
					array.unshift(object[i]);
			}
			return array;
		}
	});


	/*
	 * ------------------------------------------------------------
	 *  Object
	 * ------------------------------------------------------------
	 */

	/**
	 * Object.getPropertyDescriptor
	 * Returns a property descriptor of the specified object, including object’s prototype chain

	 * @param {Object} object
	 * @return {Object}
	 *
	 * Example:
	 *
	 * var object = {};
	 *
	 * Object.defineProperty(object, 'a', {
	 *   value: 1,
	 *   configurable: false,
	 *   enumerable:   false,
	 *   writable:     false
	 * });
	 *
	 * Object.defineProperty(object, 'b', {
	 *   value:2,
	 *   configurable: true,
	 *   enumerable:   true,
	 *   writable:     true
	 * });
	 *
	 * Object.getOwnPropertyDescriptors(object);
	 *
	 * a: {
	 *   value: 1,
	 *   configurable: false,
	 *   enumerable:   false,
	 *   writable:     false
	 * },
	 *
	 * b: {
	 *   value: 2,
	 *   configurable: true,
	 *   enumerable:   true,
	 *   writable:     true
	 * }
	**/
	define.call(Object, 'getOwnPropertyDescriptors', function(object)
	{
		if (__object__.toString.call(object) !== '[object Object]')
			throw new TypeError('Object.getOwnPropertyDescriptors: ' + object + ' is not an Object!');

		if (!Object.getOwnPropertyNames || !Object.getOwnPropertyDescriptor || !Object.defineProperty)
			return object;

		var descriptors = {};

		__array__.forEach.call(Object.getOwnPropertyNames(object), function (property)
		{
			Object.defineProperty(descriptors, property, {
				value: Object.getOwnPropertyDescriptor(object, property),
				configurable: false,
				enumerable:   true,
				writable:     false
			});
		});

		return descriptors;
	});


	/**
	 * Object.getPropertyDescriptor
	 * Returns a property descriptor of the specified object, including object’s prototype chain
	 *
	 * @param {Object} object
	 * @param {String} name - The name of the property
	 * @return {Object}
	 *
	 * Example:
	 *
	 * Object.getPropertyDescriptor({}, 'toString');
	 *
	 * {
	 *    value: [Function: toString],
	 *    writable: true,
	 *    enumerable: false,
	 *    configurable: true
	 * }
	**/
	define.call(Object, 'getPropertyDescriptor', function(object, name)
	{
		if (__object__.toString.call(object) !== '[object Object]')
			throw new TypeError('Object.getPropertyDescriptor: ' + object + ' is not an Object!');

		if (!Object.getOwnPropertyDescriptor || !Object.getPrototypeOf)
			return object;

		var descriptor = Object.getOwnPropertyDescriptor(object, name),
		__proto__ = Object.getPrototypeOf(object);

		while (descriptor === undefined && __proto__ !== null) {
			descriptor = Object.getOwnPropertyDescriptor(__proto__, name);
			__proto__ = Object.getPrototypeOf(__proto__);
		}

		return descriptor;
	});

	/**
	 * Object.getPropertyNames
	 * Returns an array of all the names of the properties
	 *
	 * @param {Object} object
	 * @return {Array}
	 *
	 * Example:
	 *
	 * Object.getPropertyNames({});
	 *
	 * [
	 *  'toString',
	 *  'toLocaleString',
	 *  'hasOwnProperty',
	 *  'valueOf',
	 *  'constructor',
	 *  'propertyIsEnumerable',
	 *  'isPrototypeOf',
	 *  ]
	**/
	define.call(Object, 'getPropertyNames', function(object)
	{
		if (__object__.toString.call(object) !== '[object Object]')
			throw new TypeError('Object.getPropertyNames: ' + object + ' is not an Object!');

		if (!Object.getOwnPropertyNames || !Object.getPrototypeOf)
			return object;

		var properies = Object.getOwnPropertyNames(object),
			__proto__ = Object.getPrototypeOf(object);

		while (__proto__ !== null)
		{
			__array__.forEach.call(Object.getOwnPropertyNames(__proto__), function(property) {
				if (properies.indexOf(property) === -1)
					properies.push(property);
			});

			__proto__ = Object.getPrototypeOf(__proto__);
		}

		return properies;
	});

	/**
	 * Object.is
	 * The internal comparison abstract operation SameValue(x, y),
	 * where x and y are ECMAScript language values, produces true or false (ECMAScript 5 9.12).
	 *
	 * @param {Generiс} - first generic value for egal comparison
	 * @param {Generiс} - second generic value for egal comparison
	 * @return {Boolean}
	 *
	 * Example:
	 *
	 * Object.is(0,-0)     // false
	 * Object.is('0', 0)   // false
	 * Object.is(0, 0)     // true
	 * Object.is(NaN, NaN) // true
	**/
	define.call(Object, 'is', function(x, y)
	{
		// 0 === -0, NaN !== NaN, 0 = false, etc.
		if (x === y)
			return x !== 0 || 1 / x === 1 / y;

		// object !== object ([] !== [], {} !== {}, etc.)
		return x !== x && y !== y;
	});

	/**
	 * Object.is
	 * Opposed to the Object.is
	 *
	 * @param {Generiс} - first generic value for egal comparison
	 * @param {Generiс} - second generic value for egal comparison
	 * @return {Boolean}
	 *
	 * Example:
	 *
	 * Object.isnt(0, 0) // false
	**/
	define.call(Object, 'isnt', function(x, y) {
		return !Object.is(x, y);
	});

	/**
	 * Object.isObject
	 *
	 * @param {Object}
	 * @return {Boolean}
	 * @edition ECMA-262 6th Edition, 15.2.3.15
	 *
	 * Example:
	 *
	 * Object.isObject({}); // true
	**/
	define.call(Object, 'isObject', function(object) {
		return __object__.toString.call(object) === '[object Object]';
	});


	/**
	 * ------------------------------------------------------------
	 *  Number
	 * ------------------------------------------------------------
	**/


	var __global__ = this;

	/**
	 * Number.EPSILON
	 * The value of Number.EPSILON is the difference between 1 and the smallest value
	 * greater than 1 that is representable as a Number value, which
	 * is approximately 2.2204460492503130808472633361816 x 10-16
	 *
	 * @edition ECMA-262 6th Edition, 15.7.3.7
	 *
	 * Example:
	 *
	 * Number.EPSILON // 9007199254740991
	**/
	define.call(Number, 'EPSILON', {
		value: 2.220446049250313e-16,
		configurable: false,
		enumerable:   false,
		writable:     false
	});


	/**
	 * Number.MAX_INTEGER
	 *
	 * The value of Number.MAX_INTEGER is the largest integer value that
	 * can be represented as a Number value without losing precision, which is 9007199254740991
	 *
	 * @edition ECMA-262 6th Edition, 15.7.3.7
	 * Example:
	 *
	 * Number.MAX_INTEGER // 9007199254740991
	**/
	define.call(Number, 'MAX_INTEGER', {
		value: 9007199254740991,
		configurable: false,
		enumerable:   false,
		writable:     false
	});


	/**
	 * Number.parseInt
	 * Produces an integer value dictated by interpretation of the contents of the string
	 * argument according to the specified radix. Leading white space in string is ignored.
	 * If radix is undefined or 0,
	 * it is assumed to be 10 except when the number begins with the character pairs 0x or 0X,
	 * in which case a radix of 16 is assumed. If radix is 16, the number may also optionally
	 * begin with the character pairs 0x or 0X.

	 * @param {String} - value
	 * @param {Number} - radix
	 * The radix parameter is used to specify which numeral system to be used,
	 * for example, a radix of 16 (hexadecimal) indicates that the number in the string
	 * should be parsed from a hexadecimal number to a decimal number.
	 *
	 * @return {Number} Parses a string or integer and returns an integer.
	 * @edition ECMA-262 6th Edition, 15.7.3.8
	 *
	 * Example:
	 *
	 * Number.parseInt(0xF, 16) // 21
	**/
	define.call(Number, 'parseInt', function(value, radix) {
		return __global__.parseInt.call(null, value, radix | 0 || 10);
	});


	/**
	 * Number.parseFloat
	 *
	 * @param {String} - value
	 * @return {Number} Parses a string or integer and returns a floating point number.
	 * returns true otherwise.
	 *
	 * @edition ECMA-262 6th Edition, 15.7.3.9
	 *
	 * Example:
	 *
	 * Number.parseFloat('1px') // 1
	**/
	define.call(Number, 'parseFloat', function(value) {
		return __global__.parseFloat(value);
	});

	/**
	 * Number.isNaN
	 *
	 * @param {Number} - value
	 * @return {Boolean} Returns true if the supplied number is NaN, false otherwise;
	 * returns true otherwise.
	 * @edition ECMA-262 6th Edition, 15.7.3.10
	 *
	 * Example:
	 *
	 * Number.isNaN(NaN) // true
	 * Number.isNaN(1)   // false
	**/
	define.call(Number, 'isNaN', function(value) {
		return typeof value === 'number' && __global__.isNaN(value);
	});


	/**
	 * Number.isFinite
	 *
	 * @param {Generiс} - value
	 * @return {Boolean} Returns false if the supplied number is NaN, Infinity or -Infinity;
	 * returns true otherwise.
	 *
	 * @edition ECMA-262 6th Edition, 15.7.3.11
	 *
	 * Example:
	 *
	 * Number.isFinite(NaN) // false
	 * Number.isFinite(0)   // true
	**/
	define.call(Number, 'isFinite', function(value) {
		return typeof value === 'number' && __global__.isFinite(value);
	});


	/**
	 * Number.isInteger
	 * Add a toInteger property be to the Number constructor,
	 * for converting values to IEEE-754 double precision integers,
	 * exactly as ECMA-262’s ToInteger internal method.
	 *
	 * @param {Number} - value
	 * @return {Boolean}
	 * @edition ECMA-262 6th Edition, 15.7.3.12
	 *
	 * Example:
	 *
	 * Number.isInteger(NaN) // false
	 * Number.isFinite(1)    // true
	 * Number.isFinite('1')  // false

	**/
	define.call(Number, 'isInteger', function(value)
	{
		return typeof value === 'number' && __global__.isFinite(value) &&
		value > -Number.MAX_INTEGER && value < Number.MAX_INTEGER && Math.floor(value) === value;
	});


	/**
	 * Number.toInteger
	 *
	 * @param {Number} - value
	 * @return {Boolean} Returns false if the supplied number is NaN, Infinity or -Infinity;
	 * returns true otherwise.
	 *
	 * @edition ECMA-262 6th Edition, 15.7.3.13
	 *
	 * Example:
	 *
	 * Number.toInteger(NaN) // false
	 * Number.toInteger(0)   // true
	**/
	define.call(Number, 'toInteger', function(value)
	{
		var number = Number(value);

		if (__global__.isNaN(value))
			return +0;

		if (number === 0 || !Number.isFinite(value))
			return number;

		return Math.sign(number) * Math.floor(Math.abs(number));
	});


	/**
	 * ------------------------------------------------------------
	 *  Math
	 * ------------------------------------------------------------
	**/


	/**
	 * Math.log10
	 * Returns an implementation-dependent approximation to the base 2 logarithm of <value>
	 *
	 * @param {Number} - value
	 * @return {Number}
	 * @edition ECMA-262 6th Edition, 15.8.2.19
	 *
	 * Example:
	 *
	 * Number.log10(10) // 0.9999999999999999
	**/
	define.call(Math, 'log10', function(value) {
		return Math.log(value) * (1 / Math.LN10);
	});


	/**
	 * Math.log10
	 * Returns an implementation-dependent approximation to the base 10 logarithm of <value>
	 * @param {Number} - value
	 * @return {Number}
	 * @edition ECMA-262 6th Edition, 15.8.2.20
	 *
	 * Example:
	 *
	 * Number.log2(10) // 3.3219280948873626
	**/
	define.call(Math, 'log2', function(value) {
		return Math.log(value) * (1 / Math.LN2);
	});


	/**
	 * Math.log1p
	 * Returns an implementation-dependent approximation to the natural logarithm of 1 + <value>.
	 * The result is computed in a way that is accurate even when the value of <value> is close to zero.
	 * @param {Number} - value
	 * @return {Number}
	 * @edition ECMA-262 6th Edition, 15.8.2.21
	 *
	 * Example:
	 *
	 * Number.log1p(10) // 2.3978952727983707
	**/
	define.call(Math, 'log1p', function(value) {
		return (value > -1.0e-8 && value < 1.0e-8) ? (value - value * value / 2) : Math.log(1 + value);
	});


	/**
	 * Math. expm1
	 * Returns an implementation-dependent approximation to subtracting 1
	 * from the exponential function of <value> The result is computed in a way
	 * that is accurate even when the <value> of value is close 0.
	 * @param {Number} - value
	 * @return {Number}
	 * @edition ECMA-262 6th Edition, 15.8.2.22
	 *
	 * Example:
	 *
	 * Number.expm1(10) // 22025.465794806718
	**/
	define.call(Math, 'expm1', function(value) {
		return (value > -1.0e-6 && value < 1.0e-6) ? (value + value * value / 2) : (Math.exp(value) - 1);
	});


	/**
	 * Math.cosh
	 * Returns an implementation-dependent approximation to the hyperbolic cosine of <value>
	 * @param {Number} - value
	 * @return {Number}
	 * @edition ECMA-262 6th Edition, 15.8.2.23
	 *
	 * Example:
	 *
	 * Number.cosh(10) // 11013.232920103324
	**/
	define.call(Math, 'cosh', function(value) {
		return (Math.exp(value) + Math.exp(-value)) / 2;
	});


	/**
	 * Math.sinh
	 * Returns an implementation-dependent approximation to the hyperbolic sine of <value>
	 * @param {Number} - value
	 * @return {Number}
	 * @edition ECMA-262 6th Edition, 15.8.2.24
	 *
	 * Example:
	 *
	 * Number.sinh(10) // 11013.232874703393
	**/
	define.call(Math, 'sinh', function(value) {
		return (Math.exp(value) - Math.exp(-value)) / 2;
	});


	/**
	 * Math.tanh
	 * Returns an implementation-dependent approximation to the hyperbolic tangent of <value>
	 * @param {Number} - value
	 * @return {Number}
	 * @edition ECMA-262 6th Edition, 15.8.2.25
	 *
	 * Example:
	 *
	 * Number.tanh(10) // 0.9999999958776926
	**/
	define.call(Math, 'tanh', function(value) {
		return (Math.exp(value) - Math.exp(-value)) / (Math.exp(value) + Math.exp(-value));
	});


	/**
	 * Math.acosh
	 * Returns an implementation-dependent approximation to the inverse hyperbolic cosine of <value>
	 * @param {Number} - value
	 * @return {Number}
	 * @edition ECMA-262 6th Edition, 15.8.2.26
	 *
	 * Example:
	 *
	 * Number.acosh(10) // 2.993222846126381
	**/
	define.call(Math, 'acosh', function(value) {
		return Math.log(value + Math.sqrt(value * value - 1));
	});


	/**
	 * Math.asinh
	 * Returns an implementation-dependent approximation to the inverse hyperbolic sine of <value>
	 * @param {Number} - value
	 * @return {Number}
	 * @edition ECMA-262 6th Edition, 15.8.2.27
	 *
	 * Example:
	 *
	 * Number.asinh(10) // 2.99822295029797
	**/
	define.call(Math, 'asinh', function(value) {
		return Math.log(value + Math.sqrt(value * value + 1));
	});

	/**
	 * Math.atanh
	 * Returns an implementation-dependent approximation to the inverse hyperbolic tangent of <value>
	 * @param {Number} - value
	 * @return {Number}
	 * @edition ECMA-262 6th Edition, 15.8.2.28
	 *
	 * Example:
	 *
	 * Math.atanh(-1) // -Infinity
	**/
	define.call(Math, 'atanh', function(value) {
		return 0.5 * Math.log((1 + value) / (1 - value));
	});


	/**
	 * Math.hypot
	 * Given two or three arguments, hypot returns an implementation-dependent approximation
	 * of the square root of the sum of squares of its arguments.
	 * @param {Number} - value
	 * @return {Number}
	 * @edition ECMA-262 6th Edition, 15.8.2.29
	 *
	 * Example:
	 *
	 * Math.hypot(1, 1) // 1.4142135623730951
	**/
	define.call(Math, 'hypot', function(x, y) {
		return Math.sqrt(x * x + y * y);
	});


	/**
	 * Math.trunc
	 * Returns the integral part of the number <value>, removing any fractional digits.
	 * If <value> is already an integer, the result is <value>
	 * @param {Number} - value
	 * @return {Number}
	 * @edition ECMA-262 6th Edition, 15.8.2.30
	 *
	 * Example:
	 *
	 * Math.trunc(1.1) // 1
	**/
	define.call(Math, 'trunc', function(value) {
		return !Number.isFinite(value) ? value : value | 0;
	});


	/**
	 * Math.sign
	 * Returns the sign of the <value>, indicating whether <value> is positive, negative or zero
	 * @param {Number} - value
	 * @return {Number}
	 * @edition ECMA-262 6th Edition, 15.8.2.31
	 *
	 * Example:
	 *
	 * Math.sign(-10); // 1
	**/
	define.call(Math, 'sign', function(value) {
		if (value === 0 /* +0, -0 */ || __global__.isNaN(value))
			return value;

		return value < 0 ? -1 : 1;
	});


	/**
	 * Math.cbrt
	 * Returns an implementation-dependent approximation to the cube root of <value>
	 * @param {Number} - value
	 * @return {Number}
	 * @edition ECMA-262 6th Edition, 15.8.2.32
	 *
	 * Example:
	 *
	 * Math.cbrt(10); // 2.154434690031884
	**/
	define.call(Math, 'cbrt', function(value) {
		return value > 0 ? Math.exp(Math.log(value) / 3) : -Math.exp(Math.log(-value) / 3);
	});

}(Object.prototype, Array.prototype));