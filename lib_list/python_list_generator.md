
## Content farm blocklist generator

#### Import lib
```python
import time
import datetime
import requests
import pandas
```
### Time
```python
today = datetime.datetime.now()
generated_time = today.strftime('%Y-%m-%d' "T" '%H:%M:%S' "+8:00")
```

### DataFrame
```python
status = pandas.DataFrame({
    "urls": [
        "// Version: 0.0.6",
        f"// TimeUpdated: {generated_time}",
        "// Page: https://github.takahashi65.info/"
        ],
    "description": ['','',''],
    })
```
```python
filter_status = pandas.DataFrame({
    "urls": [
        "! Title: Content Farm Blocklist",
        "! Version: 0.0.10",
        f"! TimeUpdated: {generated_time}",
        "! Page: https://github.takahashi65.info/"
        ],
    "description": ['','','',''],
    })
```

### Content_farms
```python
url_1 = "https://danny0838.github.io/content-farm-terminator/files/blocklist/content-farms.txt"
urllib.request.urlretrieve(url_1, "list_1.txt")

content_farms = pandas.read_csv('list_1.txt', sep=" ", header=None)
content_farms.columns = ["urls","description"]
```

### Nearly_content_farms
```python
url_2 = "https://danny0838.github.io/content-farm-terminator/files/blocklist/nearly-content-farms.txt"
urllib.request.urlretrieve(url_2, "list_2.txt")
time.sleep(5)

nearly_content_farms = pandas.read_csv('list_2.txt', sep=" ", header=None)
nearly_content_farms.columns = ["urls","description"]
```

### SNS_content_farms
```python
url_3 = "https://danny0838.github.io/content-farm-terminator/files/blocklist/sns-content-farms.txt"
urllib.request.urlretrieve(url_3, "list_3.txt")
time.sleep(5)

sns_content_farms = pandas.read_csv('list_3.txt', sep=" ", header=None)
sns_content_farms.columns = ["urls","description"]
```
### Fake_News
```python
url_4 = "https://danny0838.github.io/content-farm-terminator/files/blocklist/fake-news.txt"
urllib.request.urlretrieve(url_4, "list_4.txt")
time.sleep(5)

fake_news = pandas.read_csv('list_4.txt', sep=" ", header=None)
fake_news.columns = ["urls","description"]
```

### Scam_sites
```python
url_5 = "https://danny0838.github.io/content-farm-terminator/files/blocklist/scam-sites.txt"
urllib.request.urlretrieve(url_5, "list_5.txt")
time.sleep(5)

scam_sites = pandas.read_csv('list_5.txt', sep=" ", header=None)
scam_sites.columns = ["urls","description"]
```

### Pro_china_media
```python
pro_china_media = pandas.read_csv('pro-china-media.txt', sep=" ", header=None)
pro_china_media.columns = ["urls","description"]
```

### Costum_list
```python
costum_list = pandas.read_csv('costum-list.txt', sep=" ", header=None)
costum_list.columns = ["urls","description"]
```

### Combine
```python
combine_list = pandas.concat([
    status,
    content_farms,
    nearly_content_farms,
    sns_content_farms,
    fake_news,
    scam_sites,
    pro_china_media,
    costum_list], axis=0)

filter_list = pandas.concat([
    filter_status,
    content_farms,
    nearly_content_farms,
    sns_content_farms,
    fake_news,
    scam_sites,
    pro_china_media,
    costum_list], axis=0)
```
### Drop duplicate
```python
combine_list = df.drop_duplicates('urls')
filter_list = df.drop_duplicates('urls')
```