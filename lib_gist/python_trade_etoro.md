
## Processing eToro Trade History

### Read Data
```python
#Import pandas
import pandas

#Reading Trade Data
trade = pandas.read_csv("eToroAccountStatement.csv", encoding="utf-8")

#Check
etoro_trade.info()
```

### Drop Trader Copy, Remaining Manual Control
```python
self_trade = etoro_trade[etoro_trade["跟單交易員名字"].isna()]

#Check
self_trade.head(5)
```

### Save to file
```python
self_trade.to_csv("手動交易紀錄.csv", mode="w", encoding="utf_8_sig")
``` 