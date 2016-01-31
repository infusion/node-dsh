var shell = require('../dsh');

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
  ps: '>> ',
  historyPath: '/home/.dsh_history'
});

// Start the shell
shell.open();
