var mysql = require('mysql');
var dbconfig = require('../config/dbconfig');
var connection = mysql.createConnection(dbconfig.sql_db_info);

connection.connect();
connection.query('Select temp_id, close from temp Where temp_id<40', function(error, result, fields){
	if(error) throw error;
	console.log(result);
	var curr_EMA_26 = 1376.8034524999998;
	var prev_EMA_26 = 0;
	var total_EMA_26 = 0;
	for(i=27; i<37; i++){
		prev_EMA_26 = curr_EMA_26;
		curr_EMA_26 = calcEMA(prev_EMA_26, results[i].Close, 0.0741);
		total_EMA_26+=curr_EMA_26
	}
	console.log(total_EMA_26);
});
connection.end();

function calcEMA(prevEMA, close, mult){
	return (close-prevEMA)*mult+prevEMA;
}