var query = "Select * from(Select t1.id_15_min_candles as candleID, t1.company_id as comanyID, t1.timestamp as candleTime, t1.Close as closePrice from \
( \
Select *, greatest(Open, Close) as maxOC, ABS(close-open) as diffOC, LEAST(Open, Close) as minOC from \
	15_min_candles  -- where company_id < 40 \
	having \
	High<=(100.15/100)*maxOC\
	AND \
	(diffOC/minOC)<0.006 \
	AND \
	(minOC-Low)>=2*diffOC \
	AND\
	((minOC-Low)/Low) >= 0.005 \
	Order By timestamp \
) t1 \
\
join 15_min_candles as t2 on \
	t1.company_id = t2.company_id \
	AND \
	t2.timestamp < t1.timestamp \
	AND \
	t2.timestamp > DATE_ADD(t1.timestamp, INTERVAL -151 MINUTE)\
	AND \
	((t1.close-t2.open)*100)/t1.close>2.5) intialCandles"

module.exports = {
	 BearishHanginMan: function(connection){
	 	connection.connect()
	 	connection.query(query, function (error, results, fields){
	  		if (error) {
	  			throw error;
	  		}
	  		console.log(results);
	  		connection.end();
		});
	}
}