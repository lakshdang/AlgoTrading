var mysql = require('mysql');
var dbconfig = require('./config/dbconfig');
var connection = mysql.createConnection(dbconfig.sql_db_info);
var dir = "./15MinCandleData/";
var fs = require('fs');
var path = require('path');

// var data = require("./15MinCandleData/ACC.json");

// var 
// 	data.candles.forEach(function(candle){
// 		var curr = [];
// 		curr.push(1);
// 		curr.push(timeStampFormat(candle[0]));
// 		curr.push(candle[1]);
// 		curr.push(candle[4]);
// 		curr.push(candle[2]);
// 		curr.push(candle[3]);
// 		curr.push(candle[5]);
// 		values.push(curr);
// 	});

fs.readdir(dir, function(err, files){
	var companyId = 0;
	if(err)
		throw err;
	files.forEach(function(file, index){
		if(file.indexOf('.json')>-1){
			var values = [];
			companyId++;
			var data = require(dir + file);
			var candles = data.candles;
			// console.log(companyId + " " + data.candles.length);
			
			candles.forEach(function(candle){
				var curr = [];
				curr.push(companyId);
				curr.push(timeStampFormat(candle[0]));
				curr.push(candle[1]);
				curr.push(candle[4]);
				curr.push(candle[2]);
				curr.push(candle[3]);
				curr.push(candle[5]);
				values.push(curr);
			});

			connection.connect();
			connection.query('Insert into 15_min_candles_test (company_id, timestamp, Open, Close, High, Low, Volume) Values ?', [values], function(error, result, fields){
				if(error)throw error;
				else console.log(result);
			});
			connection.end();
		}
	})
	// console.log("Total candles: " + values.length);


});


// connection.connect();

// connection.query('Insert into 15_min_candle_test (company_id, timestamp, Open, Close, High, Low, Volume) Values ?', [values], function(error, result, fields){
// 	if(error)throw error;
// 	else console.log(result);
// });

// connection.end();


// helper functions

function timeStampFormat(orig){
	var ret = orig.substring(0, 10) + " " + orig.substring(11, 19);
	// console.log(ret);
	return ret;
}