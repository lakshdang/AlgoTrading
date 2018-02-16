-- Create View temp as
-- (Select * from
-- (
-- 	Select candleID, companyID, candleTime, closePrice
-- 	from 
-- 		(
-- 		Select t1.id_15_min_candles as candleID, t1.company_id as companyID, t1.timestamp as candleTime, t1.Close as closePrice  
-- 		from 
-- 		( 
-- 			Select *, greatest(Open, Close) as maxOC, ABS(close-open) as diffOC, LEAST(Open, Close) as minOC from   
-- 			15_min_candles  -- where company_id < 40  
-- 			having   
-- 			High<=(100.15/100)*maxOC  
-- 			AND   
-- 			(diffOC/minOC)<0.006   
-- 			AND   
-- 			(minOC-Low)>=2*diffOC   
-- 			AND  
-- 			((minOC-Low)/Low) >= 0.005   
-- 			Order By timestamp 
-- 		) t1  
-- 		join 
-- 		15_min_candles as t2 
-- 		on  
-- 		t1.company_id = t2.company_id  
-- 		AND   
-- 		t2.timestamp < t1.timestamp  
-- 		AND  
-- 		t2.timestamp > DATE_ADD(t1.timestamp, INTERVAL -151 MINUTE)  
-- 		AND  
-- 		((t1.close-t2.open)*100)/t1.close>2.5) t3
-- 	group by  candleID, companyID, candleTime, closePrice
-- )HangingManCandles
-- 
-- join 15_min_candles as candles
-- on
-- 
-- HangingManCandles.companyID = candles.company_id
-- AND
-- candles.timestamp > HangingManCandles.candleTime
-- AND
-- candles.timestamp < date_add(HangingManCandles.candleTime, interval 301 minute));

Select t1.companyID, t1.candleTime, t1.closePrice, t1.timestamp as MaxCandleTime, t1.High from 
	temp as t1 
	join 
	(
		Select candleID, max(Close) as maxClose -- max(High) as maxHigh-- , min(Open) as minOpen, min(Close) as minClose 
        from
        temp
        Group By candleID
        
    )t2
	on
	t1.candleID = t2.candleID
	and
	t1.Close = t2.maxClose
    Order by t1.companyID, t1.candleTime , t1.timestamp;

Select count(*) as count from
(
	Select candleID from temp
    Group By candleID
)t;

-- Select * from
-- (
-- 	Select candleID, companyID, candleTime, closePrice
-- 	from 
-- 		(
-- 		Select t1.id_15_min_candles as candleID, t1.company_id as companyID, t1.timestamp as candleTime, t1.Close as closePrice  
-- 		from 
-- 		( 
-- 			Select *, greatest(Open, Close) as maxOC, ABS(close-open) as diffOC, LEAST(Open, Close) as minOC from   
-- 			15_min_candles  -- where company_id < 40  
-- 			having   
-- 			High<=(100.15/100)*maxOC  
-- 			AND   
-- 			(diffOC/minOC)<0.006   
-- 			AND   
-- 			(minOC-Low)>=2*diffOC   
-- 			AND  
-- 			((minOC-Low)/Low) >= 0.005   
-- 			Order By timestamp 
-- 		) t1  
-- 		join 
-- 		15_min_candles as t2 
-- 		on  
-- 		t1.company_id = t2.company_id  
-- 		AND   
-- 		t2.timestamp < t1.timestamp  
-- 		AND  
-- 		t2.timestamp > DATE_ADD(t1.timestamp, INTERVAL -151 MINUTE)  
-- 		AND  
-- 		((t1.close-t2.open)*100)/t1.close>2.5) t3
-- 	group by  candleID, companyID, candleTime, closePrice
-- )HangingManCandles
-- where time(HangingManCandles.candleTime) =  time("2015-08-25 15:15:00")
