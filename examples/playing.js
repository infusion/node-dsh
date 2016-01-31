

var childProc = require('child_process');
var shell = require('../dsh');

// Add event listener for an command executed
shell.on('exec', function(cmd) {

  if (cmd.indexOf('open ') === 0) {
    childProc.exec('open -a "Google Chrome" "' + cmd.slice(5) + '"', function() {
    });
  }
  else if (cmd.indexOf('ps ') === 0) {
    this.setOptions('ps', cmd.slice(3));
  }
  else if (cmd === 'quit' || cmd === 'exit') {
    this.exit();
  }
  else {
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
  ps: '$ ',
  historyPath: '/home/.dsh_history',
  exitOnCtrlC: true
});

// Start the shell
shell.open();
