const express = require('express');
const app = express();

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database('./db/testdb.sqlite3');


app.use(express.static('public'));
/*接続確認用*/
/*
app.get('/index', (req, res) => {
  connection.query(
    'SELECT * FROM items',
    (error, results) => {
      res.render('index.ejs', {items: results});
    }
  );
});
*/
app.get('/', (req, res) => {
  db.all(
    'SELECT * FROM Q ORDER BY RANDOM() LIMIT 3',
    (err, rows) => {
      res.render('sample.ejs', {ITEMS: rows});
      rows.forEach(function (row) {
          console.log(row);
        });
    }
  );
});

/*
db.get('SELECT * FROM Q', function(err, row) {
    if (err) {
        throw err;
    }
    console.log(row.ans1);
});
*/

/*db.all('SELECT * FROM Q ;', function(err, rows) {
    if (err) {
        throw err;
    }
    rows.forEach(function (row) {
        console.log(row);
      });
      app.get('/', (req, res) => {
        res.render('sample.ejs', {
          TEST: 'test',
          ITEMS: rows
        });
      });
});

*/
app.listen(3000);
