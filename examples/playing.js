
var childProc = require('child_process');
var shell = require('../dsh');

// Add event listener for an command executed
shell.on('exec', function(cmd) {

  if (cmd.indexOf('surf ') === 0) {
    childProc.exec('open -a "Google Chrome" "' + cmd.slice(5) + '"', function() {
    });
  }
  else if (cmd.indexOf('ps=') === 0) {
    this.setOptions('ps', cmd.slice(3));
  }
  else if (cmd === 'hist') {
    this.write('The following commands were entered in the past:\n');
    for (var i = 0; i < this.history.length; i++) {
      this.write("  - " + this.history[i] + "\n");
    }
  }
  else if (cmd === 'help') {
    this.write('The following commands are available:\n');
    this.write('   surf <url>       Opens a webpage using Google Chrome\n');
    this.write('   ps=<string>      Sets the prompt string\n');
    this.write('   hist             Shows the exec history\n');
    this.write('   exit             Exits the shell\n');
    this.write('   *                Is printed\n\n');
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
  exitOnCtrlC: false,
  abortOnCtrlC: true
});

// Start the shell
shell.open();
