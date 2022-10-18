
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
        #Header 'E-Series' is contain extra
        header = ["IP","TIME","ACTION","CONTENT","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","E11","EX12"]
        log_file = pandas.read_csv(input_filename, encoding="utf-8", header=None, sep="[[\]]", names=header)
        
        #Merge
        log_file["CONTENTS"] = log_file[log_file.columns[3:]].apply(lambda x: " ".join(x.dropna().astype(str)), axis=1)
        
        #Drop
        log_file= log_file.drop(columns=["CONTENT","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","E11","EX12"])
        
        #Filename
        output_filename = input_filename.replace("txt","csv").replace("_audit","").replace("_ht","")
        
        #Save
        #Using 'utf_8_sig' if you want to using Excel import data from a text file function.
        log_file.to_csv(output_filename, encoding="utf_8_sig", index=False)
        
        return True
    #Error handling 
    except FileNotFoundError:
        print([input_filename, "SKip"])
    except Exception as error:
        print([input_filename, error])
```

### Using
```python
input_filename = input()
read_logfile(input_filename)
``` 
### Alternatively, using list
```python
logfiles = [
    "ht_audit_discussion_1.txt",
    "ht_audit_discussion_2.txt",
    "ht_audit_discussion_3.txt",
    "ht_audit_discussion_4.txt",
    "ht_audit_discussion_5.txt",
    "ht_audit_discussion_6.txt",
    "ht_audit_discussion_7.txt",
    "ht_audit_discussion_8.txt",
    "ht_audit_discussion_9.txt",
    "ht_audit_discussion_10.txt"
    ]

for logfile in logfiles:
    input_filename = logfiles
    read_logfile(input_filename)
```
