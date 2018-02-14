var fs = require('fs');
var path = require('path');

module.exports = {
	insertCompanies: function(connection, dir){
		var count = 0;
		fs.readdir(dir, function(err, files){
			if(err){
				throw err;
			}
			else{
				connection.connect()
				files.forEach(function(file, index){
					if(file.indexOf('.json')>-1){
						count++;
						insertCompany(connection, file.substring(0, file.length-5));
						// console.log(file.substring(0, file.length-5));
					}
				});
				connection.end();
			}
		});
	},

	getCandlesByCompanyID: function(connection, id){
		connection.query('SELECT * from 15_min_candles WHERE company_id = ?', id, function (error, results, fields){
	  		if (error) throw error;
	  		console.log(results.length);
		});
	},

	deleteAllCandles: function(connection){
		connection.query('DELETE from 15_min_candles', function(error, results, fields){
			if(error)throw error;
			console.log(results);
		})
	},

	insertAllFiles: function(connection, dir){
		var totalEntries = 0;
		var count = 0;
		fs.readdir(dir, function(err, files){
			if(err){
				throw err;
			}
			else{
				connection.connect();
				files.forEach(function(file, index){
					if(file.indexOf('.json')>-1){
						// console.log(file);
						count++;
						if(ccount<819){
							data = require(dir + "/" + file);
							data = data.candles;
							// insertCandles(connection, count, data);
							console.log(data.length);
							// totalEntries+=data.length;
						}
						
						// console.log(data.length);
					}
				});
				console.log(totalEntries);
				connection.end();
			}
		});
	}
}

function insertCompany(connection, companyName){
	var obj = {Name: companyName};
	connection.query('INSERT into Company_Map SET ?', obj, function (error, results, fields){
  		if (error) throw error;
  		console.log(results);
	});
}

//2018-01-24T15:15:00+0530 
function timeStampFormat(orig){
	var ret = orig.substring(0, 10) + " " + orig.substring(11, 19);
	// console.log(ret);
	return ret;
}

// "2017-11-15T09:15:00+0530",1739,1758,1731.25,1757,35431
function insertCandles(connection, cid, candles){
	// connection.connect();
	candles.forEach(function(candle){
		var candleSet = {
			company_id: cid,
			timestamp: timeStampFormat(candle[0]),
			Open: candle[1],
			Close: candle[4],
			High: candle[2],
			Low: candle[3],
			Volume: candle[5]
		}
		insertCandle(connection, candleSet);
	})
	console.log("Inserted: " + cid);
	// connection.end();
}

function insertCandle(connection, candle){
	connection.query('INSERT into 15_min_candles SET ?', candle, function(error, results, fields){
  		if (error) throw error;
  		// console.log(results);
	});
}