module.exports = {
	A: function(callback){
		console.log('A');
		setTimeout(function () {
  		callback();
		}, 10000);
	},

	B: function(){
		console.log('B');
	},

	temp: function(connection, count){
		connection.query('Select * from 15_min_candles Where company_id = 1', function(error, results, fields){
			if(error)throw error;
			console.log(count + " " + results.length);
			if(count<3)
				temp(connection, count+1)
			else
				console.log("Done");
		});
	}
}