/**
 * DSH v1.0.0 01/02/2016
 *
 * Copyright (c) 2016, Robert Eisele (robert@xarg.org)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 **/

(function() {

  var fs = require('fs');
  var EventEmitter = require('events');
  var util = require('util');
  var LineByLineReader = require('line-by-line');

  require('keypress')(process.stdin);

  var options = {
    'ps': '>> ',
    'useAlert': true,
    'exitOnCtrlC': true,
    'abortOnCtrlC': false,
    'historyPath': null,
    'historyLimit': null,
    'historyIgnoreDuplicate': false,
    'historyFilter': false,
    'async': false
  };

  // A backup of the edited command line
  var edited = '';

  // The entered command
  var entered = '';

  // The current index in the history array
  var histndx = 0;

  // The history
  var history = [];

  // The actual cursor position
  var cursor = 0;

  // Whether the history browsing is locked. This is only at startup time, when the user tries
  // to browse the history before the data from the history file read
  var lockedHistory = true;

  // Whether the input is locked. This happens when the user decides to use async 
  // exec events. As long as the done() callback isn't invoked, the shell is unable to receive new commands
  var lockedInput = false;

  function writeHistory() {

    var fd, i = 0;

    if (options.historyPath && history.length > 0) {

      try {
        fd = fs.openSync(options.historyPath, 'w+');
      } catch (e) {
        process.stdout.write('\n\033[0;31mCan\'t write history file ' + options.historyPath + '\033[0m');
        return;
      }

      if (options.historyLimit !== null) {
        i = Math.max(0, history.length - options.historyLimit);
      }

      for (; i < history.length; i++) {

        fs.writeSync(fd, history[i] + '\n');
      }
      fs.closeSync(fd);
    }
  }

  function readHistory() {

    if (options.historyPath) {

      // Read async to speed up the startup
      var lr = new LineByLineReader(options.historyPath);

      lr.on('error', function() {
        lockedHistory = false;
      });

      lr.on('end', function() {
        lockedHistory = false;
      });

      lr.on('line', function(line) {
        history.push(line);
        histndx++;
      });

    } else {
      lockedHistory = false;
    }
  }

  function alert() {

    if (options.useAlert) {
      process.stdout.write('\x07');
    }
  }

  function setCursor(num) {

    if (num === 0) {

    } else if (num < 0) {
      process.stdout.write('\033[' + (-num) + 'D');
    } else {
      process.stdout.write('\033[' + num + 'C');
    }
  }

  function deleteRestOfLine() {
    process.stdout.write('\033[K');
  }

  function DSH() {
    EventEmitter.call(this);
  }
  util.inherits(DSH, EventEmitter);

  DSH.prototype.write = function(str) {
    process.stdout.write(str);
  };

  DSH.prototype.setOptions = function(key, value) {

    if (value === undefined) {

      if (util.isObject(key)) {

        for (var i in key) {
          if (options.hasOwnProperty(i)) {
            options[i] = key[i];
          }
        }
      }

    } else {
      options[key] = value;
    }
  };

  DSH.prototype.open = function() {

    // Delete function, as it is allowed to call it only once
    DSH.prototype.open = undefined;

    readHistory();

    // Set up stdin
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    this.emit('open');

    // Show the prompt
    this.write(options.ps);

    var self = this;

    process.stdin.on('keypress', function(ch, key) {

      var ndx;

      if (lockedInput) {
        // An async process is still running
        return;
      }

      // Undo the running constraint
      self.running = true;

      if (key) {

        if (key.ctrl) {

          if (key.name === 'c') {

            if (options.exitOnCtrlC) {
              self.exit();
            } else if (options.abortOnCtrlC) {

              // Abort a long running task
              self.running = false;

              // Write a new line
              self.write('\n');

              // Set the cursor to the beginning
              cursor = 0;

              // Clear the current command
              entered = '';

              // Show prompt again
              self.write(options.ps);
            }
            return;
          }

          // If it is another control request, emit the event
          if (key.name.length === 1) {
            self.emit('control', key.name);
            return;
          }
        }

        switch (key.name) {

          case 'return':

            // Go to the next line
            self.write('\n');

            // Lock the input if it's async
            lockedInput = options.async;

            if (options.async) {
              // Get back to the user
              self.emit('exec', entered, function() {
                // Show prompt again
                self.write(options.ps);

                // Release lock
                lockedInput = false;
              });
            } else {
              // Get back to the user
              self.emit('exec', entered);
            }

            // Maintain history
            if (entered !== '' && (!options.historyIgnoreDuplicate ||
                    (0 === histndx || history[histndx - 1] !== entered))) {
              history.push(entered);
              histndx = history.length;
            }

            // Clear state
            cursor = 0;
            entered = '';
            edited = '';

            if (!options.async) {
              // Show prompt again
              self.write(options.ps);
            }
            return;

          case 'up':
          case 'down':

            if (lockedHistory) {
              // It's still locked, because history file is still being read
              alert();
              return;
            }

            if (key.name === 'up') {
              ndx = histndx - 1;
            } else {
              ndx = histndx + 1;
            }

            if (ndx >= history.length) {

              // Update the index
              histndx = history.length;

              // Set cursor on to line start
              setCursor(-cursor);

              // Get back to the command entered by the user
              self.write(edited);
              entered = edited;

              // Delete everything behind the command
              deleteRestOfLine();

              // Adjust the cursor
              cursor = edited.length;

            } else if (ndx < 0) {
              alert();
            } else {

              // Save the current input line when going up the first time
              if (key.name === 'up' && ndx + 1 === history.length) {
                edited = entered;
              }

              // Update the index
              histndx = ndx;

              // Set cursor on to line start
              setCursor(-cursor);

              // Write the history entry
              self.write(history[ndx]);
              entered = history[ndx];

              // Delete everything behind the command
              deleteRestOfLine();

              // Adjust the cursor
              cursor = history[ndx].length;
            }
            return;

          case 'left':
          case 'right':

            if (key.name === 'left') {
              ndx = cursor - 1;
            } else {
              ndx = cursor + 1;
            }

            if (ndx < 0 || ndx > entered.length) {
              alert();
            } else {
              setCursor(ndx - cursor);
              cursor = ndx;
            }
            return;

          case 'backspace':

            if (entered.length === 0) {
              alert();
              return;
            }

            // Go one step back
            setCursor(-1);

            // Write the rest of the line
            self.write(entered.slice(cursor));

            // Clear the remaining char on the right
            deleteRestOfLine();

            // Set cursor back to the right place
            setCursor(cursor - entered.length);

            // Maintain internal state
            cursor--;
            entered = entered.slice(0, cursor) + entered.slice(cursor + 1);
            return;

          case 'escape':
            // Ignore
            return;
        }
      }

      // Write the new character
      self.write(ch);

      // Write the rest of the line if we're in the middle of a command
      if (cursor < entered.length) {
        self.write(entered.slice(cursor));
        setCursor(cursor - entered.length);
      }

      // Add char to the command
      entered = entered.slice(0, cursor) + ch + entered.slice(cursor);
      edited = entered;

      // Move cursor
      cursor += ch.length;

    });
  };

  DSH.prototype.exit = function() {

    writeHistory();

    // Write a new line
    this.write('\n');

    this.emit('exit');
    process.exit();
  };

  DSH.prototype.history = history;

  DSH.prototype.running = true;

  module.exports = new DSH;

})();