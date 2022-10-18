
## Processing PDF

### Read Data
```python
#Import pandas
import pandas

#Reading Data
log_201912 = pandas.read_csv("/pdf_analyst/201912.csv",
    encoding="utf-8", skip_blank_lines=True, sep=r'\s+', skipinitialspace=False,
    names=["日期", "時間", "IP地址 / 使用者名稱/", "網址", "URL數量"])

log_202001 = pandas.read_csv("/pdf_analyst/202001.csv",
    encoding="utf-8", skip_blank_lines=True, sep=r'\s+', skipinitialspace=False,
    names=["日期", "時間", "IP地址 / 使用者名稱/", "網址", "URL數量"])

log_202002 = pandas.read_csv("/pdf_analyst/202002.csv",
    encoding="utf-8", skip_blank_lines=True, sep=r'\s+', skipinitialspace=False,
    names=["日期", "時間", "IP地址 / 使用者名稱/", "網址", "URL數量"])
```

### Merge
```python
combine = pandas.concat([log_201912, log_202001, log_202002], axis=0)

#Check
combine.head()
```

### Save to file
```python
combine.to_csv("紀錄檔.csv", encoding="utf_8_sig", index=False)
``` 