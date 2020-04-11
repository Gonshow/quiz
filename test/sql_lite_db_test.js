/*
    [sql_lite_db_test.js]
*/

var chai = require("chai");
var assert = chai.assert;
var expect = chai.expect;
var sinon = require("sinon");
var shouldFulfilled = require("promise-test-helper").shouldFulfilled;
var shouldRejected  = require("promise-test-helper").shouldRejected;
require('date-utils');

const api_sql = require("../src/sql_lite_db.js");

var TEST_CONFIG_SQL = { // テスト用。databese名以外は、SQLiteでは不要。残りはSQL Serverで利用。
    user : "fake_user",
    password : "fake_password",
    server : "fake_server_url",
    database : "./db/mydb.splite3",  //"fake_db_name",
    stream : false,

    // Use this if you're on Windows Azure
    options : {
        encrypt : true
    } // It works well on LOCAL SQL Server if this option is set.
};




describe( "sql_lite_db_test.js::SQLiteトライアル", function(){
    var createPromiseForSqlConnection = api_sql.createPromiseForSqlConnection;
    var closeConnection = api_sql.closeConnection;
    var addActivityLog2Database = api_sql.addActivityLog2Database;
    var getListOfActivityLogWhereDeviceKey = api_sql.getListOfActivityLogWhereDeviceKey;

    describe("::シークエンス調査", function(){
        it("とりあえずテスト", function(){
            var sqlConfig = { "database" : "./db/mydb.sqlite3" }; // npm test 実行フォルダ、からの相対パス
            var promise;
            this.timeout(5000);

            promise = createPromiseForSqlConnection( sqlConfig );

            promise = promise.then( function(){
                return getListOfActivityLogWhereDeviceKey( sqlConfig.database, "nyan1nyan2nyan3nayn4nayn5nyan6ny", null );
            });
/*
            promise = promise.then(function(){
                return addActivityLog2Database( sqlConfig.database, "nyan1nyan2nyan3nayn4nayn5nyan6ny", 90 );
            });
*/
            return shouldFulfilled(
                promise
            ).then(function( result ){
                console.log( result );
                closeConnection( sqlConfig.database );
            });
        });
    });
});
