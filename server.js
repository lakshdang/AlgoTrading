var mysql = require('mysql');
var dbconfig = require('./config/dbconfig');
var DB_data_entry = require('./DB_data_entry');
var connection = mysql.createConnection(dbconfig.sql_db_info);
var Hangingman = require('./DB_Searches/BearishHangingMan');
var dir = "./15MinCandleData";
var MACD = require('./TrendAnalysis/MACD');

MACD.MACD(connection);