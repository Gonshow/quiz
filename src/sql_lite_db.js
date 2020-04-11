require('date-utils'); // Data() クラスのtoString()を拡張してくれる。
var lib = require("./factory4require.js");
var factoryImpl = { // require()を使う代わりに、new Factory() する。
    "sqlite3" : new lib.Factory4Require("sqlite3"),
    "db" : new lib.Factory( {} ) // データベースごとにハッシュマップで持つ。
};

// UTデバッグ用のHookポイント。運用では外部公開しないメソッドはこっちにまとめる。
exports.factoryImpl = factoryImpl;




/**
 * ※SQL接続生成＋Json応答（OK/NG）、なのでsqliteを直接ではなく、この関数を定義する。
 *
 * @param{Object} sqlConfig     SQL接続情報。
 */
var createPromiseForSqlConnection = function( sqlConfig ){
    var db = factoryImpl.db.getInstance();
    var databaseName = sqlConfig.database;
    if( db[ databaseName ] ){
        //  sql connection is OK already!
        return Promise.resolve()
    }else{
        return new Promise(function(resolve,reject){
            var sqlite = sqlite3 = factoryImpl.sqlite3.getInstance().verbose();
            var db_connect = new sqlite.Database( sqlConfig.database, (err) =>{
                if( !err ){
                    //  sql connection is OK!
                    db[ databaseName ] = db_connect;

                    resolve();
                }else{
                    //     error on connection
                    reject(err);
                }
            });
        });
    }
};
exports.createPromiseForSqlConnection = createPromiseForSqlConnection;


var closeConnection = function( databaseName ){
    var dbs = factoryImpl.db.getInstance();
    var db = dbs[ databaseName ];
    if( !db ){
        return Promise.reject({
            "isReady" : false
        });
    }

    return new Promise(function(resolve,reject){
        db.close((err)=>{
            if(!err){
                resolve();
            }else{
                reject(err)
            }
        });
    });
};
exports.closeConnection = closeConnection;




var addActivityLog2Database = function( databaseName, deviceKey, typeOfAction ){
    var dbs = factoryImpl.db.getInstance();
    var db = dbs[ databaseName ];
    if( !db ){
        return Promise.reject({
            "isReady" : false
        });
    }

    return new Promise(function(resolve,reject){
        var now_date = new Date();
        var date_str = now_date.toFormat("YYYY-MM-DD HH24:MI:SS.000"); // data-utilsモジュールでの拡張を利用。
        var query_str = "INSERT INTO activitylogs(created_at, type, owners_hash ) VALUES('" + date_str + "', " + typeOfAction + ", '" + deviceKey + "')";

        db.all(query_str, [], (err, rows) => {
            if(!err){
                var insertedData = {
                    "type" : typeOfAction,
                    "device_key" : deviceKey
                };
                return resolve( insertedData );
            }else{
                reject({
                    "isEnableValidationProcedure" : false
                });
            }
        });
    });
};
exports.addActivityLog2Database = addActivityLog2Database;




/**
 * デバイス識別キーに紐づいたアクティビティーログを、指定されたデータベースから取得する。
 * @param{String} Database データベース名
 * @param{String} deviceKey デバイスの識別キー
 * @returns{Promise} SQLからの取得結果を返すPromiseオブジェクト。成功時resolve( recordset ) 、失敗時reject( err )。
 */
var getListOfActivityLogWhereDeviceKey = function( databaseName, deviceKey ){
    var dbs = factoryImpl.db.getInstance();
    var db = dbs[ databaseName ];
    if( !db ){
        return Promise.reject({
            "isReady" : false
        });
    }

    var query_str = "SELECT created_at, type FROM activitylogs";
    query_str += " WHERE [owners_hash]='" + deviceKey + "'";

    return new Promise(function(resolve,reject){
        db.all(query_str, [], (err, rows) => {
            if(!err){
                return resolve( rows );
            }else{
                return reject( err );
            }
        });
    });
};
exports.getListOfActivityLogWhereDeviceKey = getListOfActivityLogWhereDeviceKey;
