var mysql = require('mysql');
var dbconfig = require('./config/dbconfig');
var DB_data_entry = require('./DB_data_entry');
var connection = mysql.createConnection(dbconfig.sql_db_info);
var Hangingman = require('./DB_Searches/BearishHangingMan');
var dir = "./15MinCandleData";

// var data = require("./15MinCandleData/ICICIPRULI.json");
// console.log(data.candles.length);

// connection.connect();
// DB_data_entry.insertCompanies(connection, dir);
Hangingman.BearishHanginMan(connection);
// connection.end();