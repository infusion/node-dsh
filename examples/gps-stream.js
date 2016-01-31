
var shell = require('../dsh');
var SerialPort = require("serialport");
var GPS = require('gps.js');
var gps = new GPS;

// Add event listener for an command executed
shell.on('exec', function(cmd) {

  if (cmd === 'stream') {

    var self = this;

    // Example from https://github.com/infusion/GPS.js/blob/master/examples/serial.js
    var file = '/dev/tty.usbserial';

    var port = new SerialPort.SerialPort(file, {
      baudrate: 4800,
      parser: SerialPort.parsers.readline("\r\n")
    });

    port.on("open", function() {

      console.log('serial port open');

      gps.on('data', function(raw, data) {
        self.write(raw + "\n");
      });

      port.on('data', function(data) {

        // Close port if user asks for it
        if (!self.running) {
          port.close();
          return;
        }

        gps.update(data);
      });
    });

  }
  else if (cmd === 'exit' || cmd === 'quit') {
    this.exit();
  } else {
    this.write("CMD: " + cmd + "\n");
  }

});

// Say something
shell.on('open', function() {
  // Write message of the day
  this.write("Welcome, it is " + new Date() + "\n");
});

shell.on('exit', function() {
  this.write("See you...\n");
});

// Set some options
shell.setOptions({
  ps: '➜ ',
  exitOnCtrlC: false,
  abortOnCtrlC: true
});

// Start the shell
shell.open();
