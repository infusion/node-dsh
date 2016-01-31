![DSH](https://github.com/infusion/dsh/blob/master/logo.png?raw=true "Javascript Shell")

[![NPM Package](https://img.shields.io/npm/v/dsh.svg?style=flat)](https://npmjs.org/package/dsh "View this project on npm")
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

DSH - pronounced as dash - is a full featured shell written in JavaScript. It handles the whole user interaction and you can focus on working with the requested command with your parser.

Usage
===

```javascript
var shell = require('dsh');

// Add event listener for an command executed
shell.on('exec', function(cmd) {
   console.log('Coammand: ', cmd);
});

// Say something
shell.on('open', function() {
   this.write("Welcome to DSH\n");
});

shell.on('exit', function() {
    this.write("See you...\n");
});

// Set some options
shell.setOptions({
  ps: '$ ',
  history: '~/.dsh_history'
});

// Start the shell
shell.open();
```

Methods
===

open()
---
Function to open the actual shell

exit()
---
Function to exit the program

setOption(key[, value])
---
Sets the value of an option listed below. `key` is either an object of multiple option key-value pairs or one value is presented as a key value parameter.

on(ev, fn)
---
Sets the callback `fn` on event `ev` (see below for a full list of available events)


Events
===
open
---
exit
---
exec
---


Options
===
