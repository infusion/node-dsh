![DSH](https://github.com/infusion/node-dsh/blob/master/logo.png?raw=true "Javascript Shell")

[![NPM Package](https://img.shields.io/npm/v/dsh.svg?style=flat)](https://npmjs.org/package/dsh "View this project on npm")
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

DSH - pronounced dash - is a full featured shell written in JavaScript, which gives you endless possibilities of transforming your app into a shell application. It handles the whole user interaction and you can focus on working with the requested command with your parser.

Usage
===
The terminal window shown above can be implemented with the following snippet:

```javascript
var shell = require('dsh');

// Add event listener for an command executed
shell.on('exec', function(cmd) {
   console.log('Command:', cmd);
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
  history: '/home/.dsh_history'
});

// Start the shell
shell.open();
```

Features
===

- Configurable History
- Asynchronous execution
- No pre-set parser, full control of the input
- Small codebase, easy extensible


Installation
===
Installing DSH is as easy as cloning this repo or use the following command:

```
npm install dsh
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

running
---
A boolean flag if a long running task is still allowed to run. See gps example in the examples folder.

Events
===
open
---
The event is triggered when the shell is opened. This is the right place for your message of the day.

exit
---
The event is triggered before the program is getting terminated.

exec
---
The event is triggered for every command submitted. The callback has one parameter, the command itself.

control
---
The event is triggered when the user hits ctrl+<key> (key is any a-z without c for the moment). The callback has one parameter, the key.

Options
===

async
---
Boolean if the exec event should be asynchronous. If it is, the callback has a second argument, the `done()` callback. See the MySQL client in the examples folder.

ps
---
The prompt string, which gets prepended of each line. Default is `'>> '`

useAlert
---
Boolean to notify the user of small interaction mistakes by playing the typical beep sound. Default is true.

exitOnCtrlC
---
Boolean if the shell should exit when ctrl-c is invoked. Default is true. Alternative would be to call `exit()` on your own.

abortOnCtrlC
---
If `exitOnCtrlC` is false, then ctrl-c can be used to abort the actual writing of a command.

historyPath
---
The file path to the history file. Default is null, which means no history file is written

historyLimit
---
The maximum number of lines getting written back to the history file. Default is null, which means everything is written

historyIgnoreDuplicate
---
Boolean to ignore a command of being written to history twice, if the previous command was the same. Default is false, so every command is written to history

Copyright and licensing
===
Copyright (c) 2016, Robert Eisele (robert@xarg.org)
Dual licensed under the MIT or GPL Version 2 licenses.
