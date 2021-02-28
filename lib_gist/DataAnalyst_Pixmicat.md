
## Processing Pixmicat Logfile

### Function
```python
#Import pandas
import pandas
```

### Setting Filter
```python
def read_logfile(input_filename):
    try:
        #Trans to pandas dataframe
        log_file = pandas.read_csv(input_filename, encoding="utf-8", header=None, sep="[[\]]", names=["IP", "TIME", "ACTION", "CONTENT", "EXTRA"])
        #Merge
        log_file["CONTENTS"] = log_file[log_file.columns[3:]].apply(lambda x: " ".join(x.dropna().astype(str)), axis=1)
        #Drop
        log_file.drop(columns=["CONTENT","EXTRA"])
        #Filename
        output_filename = input_filename.replace("txt", "csv")
        #Save
        log_file.to_csv("ht_bf_audit.csv", encoding="utf_8_sig", index=False)
        return True
    except Exception:
        return False  
```

### Using
```python
input_filename = input()
read_logfile(input_filename)
``` 