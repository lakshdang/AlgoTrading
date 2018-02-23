-- SET @row_number = 0;
-- 
-- Create Table temp as(
--  SELECT 
-- 	*, (@row_number:=@row_number + 1) AS temp_id
--  	FROM
--  		15_min_candles
--  	ORDER BY
--  		company_id, timestamp);-- 
--         
-- -- Select * from temp;
-- 
-- create index temp_id_index on temp (temp_id);



Select t2.Name, t2.timestamp, count(*)
-- Select t2.Name as Company, t2.id_15_min_candles, t2.timestamp mainCandleTime, t2.Open, t2.Close, t2.High, t2.Low, t2.Volume -- ,  t1.id_15_min_candles , t1.timestamp, t1.Open, t1.Close, t1.High, t1.Low, t1.Volume 
from
(Select t1.temp_id, t2.id_15_min_candles, t2.timestamp, t2.Open, t2.Close, t2.High, t2.Low, t2.Volume from
-- Select t1.company_id, count(t1.company_id) from
(Select t1.temp_id, t1.company_id
From
(
	Select * 
	from Temp
    Where
    High <= 1.15 * greatest(Open, Close)
    AND
    100*(abs(Open-Close)/least(Open, Close))<=0.6
	AND
    100*((least(Open, Close)-Low)/Low)>=0.5
    AND
    least(Open, Close)-low >= 2*abs(Open-Close)
)t1
join
temp t2 on
t1.company_id = t2.company_id
AND
t2.temp_id > t1.temp_id
AND
t2.temp_id <= t1.temp_id+10
AND
(t1.close-t2.open)*100/t1.close>=2.5
Group By t1.temp_id, t1.company_id
)t1
join temp t2
on t1.company_id = t2.company_id
AND
t2.temp_id>t1.temp_id
AND
t2.temp_id<=t1.temp_id+20)t1
Join
(
	Select t.*, cm.Name from
    Temp t join Company_Map cm on t.company_id = cm.id_Company_Map
)t2
-- temp t2
on
t1.temp_id = t2.temp_id

GROUP BY
t2.Name, t2.timestamp
;


-- Select * from 15_min_candles t1 where weekday(t1.timestamp) = 5;


-- Drop table temp;
