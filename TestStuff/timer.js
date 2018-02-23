var mysql = require('mysql');
var dbconfig = require('../config/dbconfig');
var connection = mysql.createConnection(dbconfig.sql_db_info);
var fs = require('fs');
var path = require('path');
var dir = "../15MinCandleData/";

function testFileInsert(connection){
	fs.readdir(dir, function(err, files){
		insertFilesRecur_Mock_Its_Recursive(connection, files, 0);
	});
};

function insertFilesRecur_Mock_Its_Recursive(connection, files, idx){
	if(idx==0)connection.connect();
	if(idx>=files.length){
		connection.end();
		return;
	}
	if(files[idx].indexOf(".json")<0)
		insertFilesRecur_Mock_Its_Recursive(connection, files, idx+1);
	else{
		var candles = JSON.parse(fs.readFileSync(dir+files[idx], 'utf8')).candles;
		var values = [];
		for(i=0; i<candles.length; i++){
			var candle = [idx, timeStampFormat(candles[i][0]), candles[i][1], candles[i][4], candles[i][2], candles[i][3], candles[i][5]];
			values.push(candle);
		};
		connection.query("Insert into 15_min_candles_test (company_id, timestamp, open, close, high, low, volume) Values ?",[values], function(err, results, fields){
			console.log(results);
			insertFilesRecur_Mock_Its_Recursive(connection, files, idx+1);
		});
	}
}

fs.readdir(dir, function(err, files){
	var total = 0;
	files.forEach(function(file){
		if(file.indexOf(".json")>0)total+=JSON.parse(fs.readFileSync(dir+file, 'utf8')).candles.length;
		console.log(total);
	});
});

function timeStampFormat(orig){
	var ret = orig.substring(0, 10) + " " + orig.substring(11, 19);
	return ret;
}