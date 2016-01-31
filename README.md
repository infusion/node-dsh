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


Attributes
===

history
---
An array of commands, that were entered in the past

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

'ps'
---
The prompt string, which gets prepended of each line. Default is `'>> '`

'useAlert'
---
Boolean to notify the user of small interaction mistakes by playing the typical beep sound. Default is true.

'exitOnCtrlC'
---
Boolean if the shell should exit when ctrl-c is invoked. Default is true. Alternative would be to call `exit()` on your own.

'abortOnCtrlC'
---
If `exitOnCtrlC` is false, then ctrl-c can be used to abort the actual writing of a command.

'historyPath'
---
The file path to the history file. Default is null, which means no history file is written

'historyLimit'
---
The maximum amount of lines getting written back to the history file. Default is null, which means everything is written


Copyright and licensing
===
Copyright (c) 2016, Robert Eisele (robert@xarg.org)
Dual licensed under the MIT or GPL Version 2 licenses.
