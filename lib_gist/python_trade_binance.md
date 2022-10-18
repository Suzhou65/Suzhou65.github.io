
## Processing Binance Trade History

### Read Data
```python
#Import pandas
import pandas

#Trade Data Header
table_header = ["交易模式","交易日期","交易時間",
    "S1","交易貨幣","投入貨幣",
    "S2","投入金額", "轉換金額",
    "S3","手續費貨幣", "手續費",
    "S4","當下匯率",
    "S5","獲利",
    "S6","S7","S8","S9","S10","S11","S12","S13","S14","S15",]
#Reading Trade Data
trade = pandas.read_csv("digicurrency.csv", encoding="utf-8", names=table_header)
```

### Merge Date and Time
```python
trade["時間戳"] = trade["交易日期"] + trade["交易時間"]
```

### Drop
```python
trade.drop(columns=["交易日期","交易時間",
    "S1","S2","S3","手續費貨幣", "手續費",
    "S4","S5","獲利",
    "S6","S7","S8","S9","S10","S11","S12","S13","S14","S15"], inplace=True)

trade.drop(trade.index[0],inplace=True)
```

### Separate by Trade Coin
```python
#NEO
NEO_bought = trade.loc[trade["交易貨幣"]=="NEO"]
NEO_sold = trade.loc[trade["投入貨幣"]=="NEO"]
NEO_trade = pandas.concat([NEO_bought, NEO_sold])

#EOS
EOS_bought = trade.loc[trade["交易貨幣"]=="EOS"]
EOS_sold = trade.loc[trade["投入貨幣"]=="EOS"]
EOS_trade = pandas.concat([EOS_bought, EOS_sold])

#ETH
ETH_bought = trade.loc[trade["交易貨幣"]=="ETH"]
ETH_sold = trade.loc[trade["投入貨幣"]=="ETH"]
ETH_trade = pandas.concat([ETH_bought, ETH_sold])
```

### Save to separate file
```python
#NEO
NEO_trade.to_csv("NEO.csv", encoding="utf-8", index=False, header=True)

#EOS
EOS_trade.to_csv("EOS.csv", encoding="utf-8", index=False, header=True)

#ETH
ETH_trade.to_csv("ETH.csv", encoding="utf-8", index=False, header=True)
``` 
