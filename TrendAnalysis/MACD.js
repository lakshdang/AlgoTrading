module.exports = {
	MACD: function(connection){
		// console.log("Start");
		connection.connect();
		connection.query("Select * from temp", function(error, results, fields){
			if(error){
				connection.end();
				throw error;
			}
			connection.end();
			var candles = results;
			var totalCandles = results.length;
			var idx = 0;
			var MACDcandles = [];
			while(idx<totalCandles && candles[idx].company_id < 2){
				var company_count = 0
				var curr_company = candles[idx].company_id;
				var avg_first_prev_12 = 0;		
				var avg_first_prev_26 = 0;
				var avg_first_prev_09 = 0;
				var curr_EMA_26 = 0;
				var curr_EMA_12 = 0;
				var curr_EMA_09 = 0;
				var prev_EMA_26 = 0;
				var prev_EMA_12 = 0;
				var prev_EMA_09 = 0;
				var curr_MACD = 0;
				var prev_MACD = 0;
				var prevSign = 0;
				var curr_Sign = 0;
				var curr_Sign = 0;
				var count = 0;
				var avg_first_9_MACD = 0;

				//Total of first 26 clsoing proces for this company
				for(i=idx; i<=idx+25; i++){
					avg_first_prev_26+=candles[i].Close;
				}

				//Total of 12 clsoing proces prior to the 27th for this company
				for(i=idx+14; i<=idx+25; i++){
					avg_first_prev_12+=candles[i].Close;
				}

				//Avg of first 26 and 12 candles prior to 27th
				avg_first_prev_26/=26;
				avg_first_prev_12/=12

				//EMA_26 & EMA_12 for 27th candle as per definition
				curr_EMA_26 = (candles[idx+26].Close - avg_first_prev_26)*0.0741 + avg_first_prev_26;
				curr_EMA_12 = (candles[idx+26].Close - avg_first_prev_12)*0.1538 + avg_first_prev_12;
				console.log(curr_EMA_26, curr_EMA_12);
				//Calculate average MACD, EMA_26 & EMA_12 as per definitions for candles in the range [28-38)
				for(i=idx+27; i<=idx+35; i++){
					prev_EMA_26 = curr_EMA_26;
					prev_EMA_12 = curr_EMA_12;

					curr_EMA_26 = (candles[i].Close - prev_EMA_26)*0.0741 + prev_EMA_26;
					curr_EMA_12 = (candles[i].Close - prev_EMA_12)*0.1538 + prev_EMA_12;

					avg_first_9_MACD += curr_EMA_12 - curr_EMA_26;

				}
				avg_first_9_MACD/=9;

				//EMA_26, EMA_12 & EMA_09 for 37th candle as per definition
				prev_EMA_26 = curr_EMA_26;
				prev_EMA_12 = curr_EMA_12;
				curr_EMA_26 = (candles[idx+36].Close - prev_EMA_26)*0.0741 + prev_EMA_26;
				curr_EMA_12 = (candles[idx+36].Close - prev_EMA_12)*0.1538 + prev_EMA_12;

				curr_MACD = curr_EMA_12-curr_EMA_26;
				curr_EMA_09 = (curr_MACD - avg_first_9_MACD)*0.2 - avg_first_9_MACD;
				currSign = curr_MACD - curr_EMA_09;

				idx += 37;
				// console.log(curr_EMA_26, curr_EMA_12, curr_EMA_09, curr_MACD, curr_Sign);
				while(idx<totalCandles && candles[idx].company_id == curr_company){
					prev_EMA_26 = curr_EMA_26;
					prev_EMA_12 = curr_EMA_12;
					prev_EMA_09 = curr_EMA_09;
					prev_MACD = curr_MACD;
					prev_Sign = curr_Sign;
					curr_EMA_26 = (candles[idx].Close - prev_EMA_26)*0.0741 + prev_EMA_26;
					curr_EMA_12 = (candles[idx].Close - prev_EMA_12)*0.1538 + prev_EMA_12;
					curr_MACD = curr_EMA_12 - curr_EMA_26
					curr_EMA_09 = (curr_MACD = prev_EMA_09)*0.2 + prev_EMA_09;
					curr_Sign = curr_EMA_12 - curr_EMA_26 - curr_EMA_09
					// console.log(curr_EMA_26, curr_EMA_12, curr_EMA_09, curr_MACD, curr_Sign);
					if(curr_Sign*prev_Sign < 0)
						MACDcandles.push(candles[idx].id_15_min_candles);
					idx++;
				}

				// console.log(company_count);
				// console.log();
			}
			console.log(MACDcandles);
		});
	}
}