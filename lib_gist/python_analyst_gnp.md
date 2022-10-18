
## Processing GNP Ranking

### Read Data
```python
#Import pandas
import pandas

#Reading Trade Data
gnp_global = pandas.read_csv("GNP.csv", index_col=0)
gnp_global.drop_duplicates("Country")
gnp_global.drop(["2018","2017","2016","2015","2014"], axis=1, inplace=True)

#Check
gnp_global.head()
```

### Setting Filter
```python
global_filter = pandas.read_csv("filter.csv")
global_filter.drop_duplicates("Country")

#Check
global_filter.head()
```

### Filter and Save to file
```python
#Filter
result = gnp_global[gnp_global["Country"].isin(global_filter["Country"]) == True]

#Save
result.to_csv("ranking.csv", encoding="utf_8_sig")
``` 