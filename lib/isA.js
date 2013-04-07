/**
 * isA.js 
 *
 * Reusable node.js/browser JavaScript library that exposes some isXXX() type
 * of functions. These functions do as much as possible to provide cross
 * JavaScript VM compatible methods to determine whether or not an object is
 * of a given type.
 *
 * If this library is included in a browser via a script tag, all of it's
 * components will be placed in the window scope. 
 *
 * If this library is require()'ed in node.js, it will return a function that
 * takes either 0 or 1 parameters. If no parameters are required, the functions
 * and properties of this library are returned in a single object literal that
 * can be used for assignment normally.
 *
 * If the function is invoked with a parameter, that parameter is assumed to
 * be the scope into which these functions and properties will be copied.
 *
 * Example usage:
 *   var isA = require('isA')();        // scoped to isA param
 *   var isA = require('isA')(global);  // scoped to isA *AND* global
 *
 * @author Gabriel Harrison (nyteshade AT gmail.com)
 * @version 1.0
 */
var hasExports = typeof(exports) != 'undefined',
    namespace = hasExports ? exports :
        (typeof (window) != 'undefined') ? window : 
        (typeof (global) != 'undefined') ? global : null;

if (!namespace) {
  console.error('Cannot locate place to export library to!');
  throw new Error('Missing namespace!');
}

var library = (function(exports) {
  /**
   * Declare an array of Strings reported by the JavaScript VM to be the
   * actual toString() representation of a particular base type such that
   * it can be repeatedly compared with accuracy using the functions below.
   *
   * By not hardcoding the Strings here, we can guarantee that we are seeing
   * unique types.
   */
  exports.IS_A = {
    UNDEFINED:  Object.prototype.toString.call(undefined),
    FUNCTION:   Object.prototype.toString.call(Function()),
    BOOLEAN:    Object.prototype.toString.call(Boolean()),
    OBJECT:     Object.prototype.toString.call(Object()),
    REGEXP:     Object.prototype.toString.call(RegExp()),
    STRING:     Object.prototype.toString.call(String()),
    NUMBER:     Object.prototype.toString.call(Number()),
    ARRAY:      Object.prototype.toString.call(Array()),
    ERROR:      Object.prototype.toString.call(Error()),
    NULL:       Object.prototype.toString.call(null)
  };

  /* This back reference array allows us to quickly map existing constructors
   * for base types to their appropriate strings without having to create new
   * instances of the type for comparison. */
  var backRef = exports.IS_A_BACKREF = [
    undefined, exports.IS_A.UNDEFINED,
    Function, exports.IS_A.FUNCTION,
    Boolean, exports.IS_A.BOOLEAN,
    Object, exports.IS_A.OBJECT,
    RegExp, exports.IS_A.REGEXP,
    String, exports.IS_A.STRING,
    Number, exports.IS_A.NUMBER,
    Array, exports.IS_A.ARRAY,
    Error, exports.IS_A.ERROR,
    null, exports.IS_A.NULL
  ];

  if (!backRef.indexOf) {
    backRef.indexOf = function(obj) {
      for (var i = 0; i < backRef.length; i++) {
        if (backRef[i] === obj) {
          return i;
        }
      }
      return -1;
    };
  }

  /** Quick reference function to get correct offset of backRef */
  backRef.matchingType = function(baseConstructor) {
    var pos = this.indexOf(baseConstructor);
    if (pos === -1) { return Object.prototype.toString.call(baseConstructor); }
    return this[pos + 1];
  };

  /* Quick test to guarantee we have no repeated types and provide a way to
   * measure the accuracy of our comparison "constants" */
  var _t, _t2, _count = 0, _unique = 0, _questionable = [];
  for (_t in exports.IS_A) {
    if (exports.IS_A.hasOwnProperty(_t)) {
      var unique = true;
      for (_t2 in exports.IS_A) {
        if (exports.IS_A.hasOwnProperty(_t)) {
          if (_t === _t2) { continue; }
          unique = exports.IS_A[_t] !== exports.IS_A[_t2];
          if (!unique) {
            _questionable.push([_t, _t2]);
            break;
          }
        }
      }
      if (unique) { _unique++; }
    }
    _count++;
  }

  /** 
   * This property should reflect 1 if every type in the IS_A dictionary
   * reported unique values. This will quickly tell you if your assumptions
   * about toString() results will be accurate or not. In the case of a value
   * less than 1, exports.IS_A_QUESTIONABLE will contain pairs of keys that
   * returned the same value for your own debugging pleasure.
   */
  exports.IS_A_ACCURACY = _unique / _count;
  exports.IS_A_QUESTIONABLE = _questionable;
  if (exports.IS_A_ACCURACY !== 1.0) {
    console.warn('IS_A dictionary reported non-unique value pairs: ', 
      exports.IS_A_QUESTIONABLE);
  }

  /**
   * Cross JavaScript VM method to definitively test the type that an object
   * reports to the JavaScript engine itself. Accuracy will decline and/or
   * vary if the type is not one of the types listed in exports.IS_A, above.
   */
  exports.isA = function(type, object) {
    if (arguments.length === 1) {
      return Object.prototype.toString.call(type)
    }
    else {
      var typeString = Object.prototype.toString.call(object);
      return typeString === type
          || typeString === exports.IS_A[type]
          || typeString === backRef.matchingType(type);      
    }
  };

  /**
   * Not the most efficient way to test for undefined, but follows suit with
   * the other methods in this suite.
   *
   * @param object any object to be tested
   * @return true if the object is undefined, false otherwise
   */
  exports.isUndefined = function(object) {
    return Object.prototype.toString.call(object) === exports.IS_A.UNDEFINED;
  };

  /**
   * Cross JavaScript VM method to definitively test whether or not an object
   * is an instance of a Function. 
   *
   * @param object any object to be tested
   * @return true if the object is a function, false otherwise
   */
  exports.isFunction = function(object) {
    return Object.prototype.toString.call(object) === exports.IS_A.FUNCTION;
  };

  /**
   * Cross JavaScript VM method to definitively test whether or not an object
   * is an instance of a Boolean. 
   *
   * @param object any object to be tested
   * @return true if the object is a Boolean, false otherwise
   */
  exports.isBoolean = function(object) {
    return Object.prototype.toString.call(object) === exports.IS_A.BOOLEAN;
  };

  /**
   * Cross JavaScript VM method to definitively test whether or not an object
   * is an instance of a RegExp. 
   *
   * @param object any object to be tested
   * @return true if the object is a RegExp, false otherwise
   */
  exports.isObject = function(object) {
    return Object.prototype.toString.call(object) === exports.IS_A.OBJECT;
  };  

  /**
   * Cross JavaScript VM method to definitively test whether or not an object
   * is an instance of a RegExp. 
   *
   * @param object any object to be tested
   * @return true if the object is a RegExp, false otherwise
   */
  exports.isRegExp = function(object) {
    return Object.prototype.toString.call(object) === exports.IS_A.REGEXP;
  };

  /**
   * Cross JavaScript VM method to definitively test whether or not an object
   * is an instance of a String. 
   *
   * @param object any object to be tested
   * @return true if the object is a String, false otherwise
   */
  exports.isString = function(object) {
    return Object.prototype.toString.call(object) === exports.IS_A.STRING;
  };

  /**
   * Cross JavaScript VM method to definitively test whether or not an object
   * is an instance of a Number. 
   *
   * @param object any object to be tested
   * @return true if the object is a Number, false otherwise
   */
  exports.isNumber = function(object) {
    return Object.prototype.toString.call(object) === exports.IS_A.NUMBER;
  };

  /**
   * Cross JavaScript VM method to definitively test whether or not an object
   * is an instance of an Array. 
   *
   * @param object any object to be tested
   * @return true if the object is an Array, false otherwise
   */
  exports.isArray = function(object) {
    return Object.prototype.toString.call(object) === exports.IS_A.ARRAY;
  };

  /**
   * Cross JavaScript VM method to definitively test whether or not an object
   * is an instance of an Error. 
   *
   * @param object any object to be tested
   * @return true if the object is an Error, false otherwise
   */
  exports.isError = function(object) {
    return Object.prototype.toString.call(object) === exports.IS_A.ERROR;
  };

  /**
   * Not the most efficient way to test for null, but follows suit with
   * the other methods in this suite.
   *
   * @param object any object to be tested
   * @return true if the object is null, false otherwise
   */
  exports.isNull = function(object) {
    return Object.prototype.toString.call(object) === exports.IS_A.NULL;
  };

  /**
   * Inject isA library to the supplied scope. If null or undefined are given
   * as the destinationScope an exception will be thrown.
   *
   * @param destinationScope the scope to dump these library functions to
   */
  exports.INJECT_IS_A_LIB = function(destinationScope) {
    if (destinationScope === null || destinationScope === undefined) {
      throw new Error("Cannot locate destination scope to install to.");
    }
    for (var property in exports) {
      if (exports.hasOwnProperty(property)) {
        destinationScope[property] = exports[property];
      }
    }
    return exports;
  };

  return exports;
})({});

if (hasExports) {
  module.exports = function(destination) {
    if (!destination) {
      return library;
    }
    else {
      return library.INJECT_IS_A_LIB(destination);
    }
  };
}
else {
  namespace.isA = library.INJECT_IS_A_LIB(namespace);
}
