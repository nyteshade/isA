**isA.js**

-=-=-=-=-=-

**Installation**

To install the isA library, invoke
```shell
npm install isa-lib
```

**About**

Reusable node.js/browser JavaScript library that exposes some isXXX() type of functions. These functions do as much as possible to provide cross JavaScript VM compatible methods to determine whether or not an object is of a given type.

If this library is included in a browser via a script tag, all of it's components will be placed in the window scope.

Example Usage:
```html
<script type="text/javascript" src="/path/to/isA.js"></script>
<script type="text/javascript">
  console.log(isA(IS_A.NUMBER, 5));       // true
  console.log(isNumber(5));               // true
  console.log(isA(5, 5));                 // true
  console.log(isA(5));                    // "[object Number]"
  console.log(IS_A.NUMBER);               // "[object Number]"
  console.log('NUMBER', 5);               // true
  console.log(isA("[object Number]", 5)); // true
  console.log(isA(Number(), 5));          // true
</script>
```

If this library is require()'ed in node.js, it will return a function that takes either 0 or 1 parameters. If no parameters are required, the functions and properties of this library are returned in a single object literal that
can be used for assignment normally. If the function is invoked with a parameter, that parameter is assumed to be the scope into which these functions and properties will be copied.

Example usage:
```javascript
  var isA = require('isa-lib')();        // scoped to isA param
  var isA = require('isa-lib')(global);  // scoped to isA *AND* global
```



