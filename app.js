const express = require('express');
const app = express();

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database('./sample.sqlite3');

app.use(express.static('public'));
/*接続確認用*/

/*app.get('/', (req, res) => {
  res.render('hello.ejs',
  {
    TEST: 'test'
  }
);
});
*/
/*db.get('SELECT * FROM Q', function(err, row) {
    if (err) {
        throw err;
    }
    console.log(row.ans1);
});
*/

db.all('SELECT * FROM Q', function(err, rows) {
    if (err) {
        throw err;
    }
    rows.forEach(function (row) {
        console.log(row.ans1);
      });
      app.get('/', (req, res) => {
        res.render('sample.ejs', {
          TEST: 'test',
          ITEMS: rows
        });
      });
});



/*app.get('/index', (req, res) => {
  db.query(
    'SELECT ans FROM Q',
    (error, results) => {
      res.render('sample.ejs', {Q: results});
    }
  );
});*/


app.listen(3000);
