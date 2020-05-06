const express = require('express');
const app = express();

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database('./db/testdb.sqlite3');


app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

/*接続確認用*/
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
app.post('/', (req, res) =>{
  //console.log(req.body.itemName);
  db.all(
    'SELECT * FROM Q ORDER BY RANDOM() LIMIT 3',
    (err, rows) => {
      res.render('sample.ejs', {ITEMS: rows});
      rows.forEach(function (row) {
          console.log(row);
        });
    }
  );
}
);
/*
db.get('SELECT * FROM Q', function(err, row) {
    if (err) {
        throw err;
    }
    console.log(row.ans1);
});
*/

app.listen(3000);
