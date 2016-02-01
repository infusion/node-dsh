
var shell = require('../dsh');

var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test'
});

connection.connect(function(err) {
  if (err)
    throw err;

  shell.on('exec', function(cmd, done) {

    if (cmd === 'quit' || cmd === 'quit;') {
      done();
      connection.end();
      this.exit();
    }

    if (cmd === "") {
      done();
      return;
    }

    connection.query(cmd, function(err, results) {

      if (err)
        throw err;

      for (var i = 0; i < results.length; i++) {

        var set = results[i];

        for (var j in set) {

          console.log("   " + j + ": " + results[i][j]);
        }
        console.log();
      }
      done();
    });

  });

  shell.on('open', function() {
    this.write("Welcome to the MySQL monitor.  Commands end with ;\nYour MySQL connection id is " + connection.threadId + "\n\nCopyright (c) 2016 Robert Eisele\n\n");
  });

  shell.on('exit', function() {
    this.write("See you...\n");
  });

  shell.setOptions({
    ps: 'mysql> ',
    exitOnCtrlC: false,
    abortOnCtrlC: true,
    async: true,
    historyPath: '/home/.mysql_history'
  });

  shell.open();
});
