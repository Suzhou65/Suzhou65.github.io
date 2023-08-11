## Processing Pixmicat Logfile
Convert Pixmicat! log file into CSV format.
### Import Module
```python
# -*- coding: utf-8 -*-
import subprocess
import pandas as pd
```
### FileName matchimg
```python
def filename_check(list_result):
    # String "pixmicat_log" setting as you logfile configuration.
    if list_result.find("audit") != -1:
        return True 
    else:
        return False
```
### Log2CSV
```python
def read_logfile(input_filename):
    try:
        # Trans to pandas dataframe
        # Header 'E-Series' is contain extra
        header = ["IP","TIME","ACTION","CONTENT","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","E11","EX12"]
        log_file = pd.read_csv(input_filename, encoding="utf-8", header=None, sep="[\[\]]", names=header, engine="python")
        # Merge
        log_file["CONTENTS"] = log_file[log_file.columns[3:]].apply(lambda x: " ".join(x.dropna().astype(str)), axis=1)
        # Drop
        log_file= log_file.drop(columns=["CONTENT","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","E11","EX12"])
        # Filename
        if input_filename.find("txt") == -1:
            output_filename = input_filename.replace("ht","").replace("_audit","") + (".csv")
        else:
            output_filename = input_filename.replace("ht","").replace("_audit","").replace(".txt",".csv")
        # Save
        # Using 'utf_8_sig' if you want to using Excel import data from a text file function.
        log_file.to_csv(output_filename, encoding="utf_8_sig", index=False)
        # Print Info when translation complete
        print([input_filename, "Translation Complete"])
    # Error handling 
    except FileNotFoundError:
        print([input_filename, "SKip"])
    except Exception as error:
        print([input_filename, error])
```
### Using
```python
# Ask list
list_asking = subprocess.Popen(["ls", "-ls"], stdout=subprocess.PIPE)
# AWK filter
filter_awk = ["awk", "{print $10}"]
filter_output = subprocess.Popen(filter_awk, stdin=list_asking.stdout, stdout=subprocess.PIPE)
# Dump into cache
result_bytes = filter_output.communicate()[0]
# Decode
result_utf8 = result_bytes.decode("utf-8")
# Listing
list_result = result_utf8.split("\n")
# Remove unmatch
match_filenames = filter(filename_check, list_result)
input_filenames = list(match_filenames)

# Running convert
for input_filename in input_filenames:
    read_logfile(input_filename)
``` 
### Alternatively, Manual
```python
input_filename = input()
read_logfile(input_filename)
```

### FutureWarning issue
You may get this warning
```
/opt/homebrew/lib/python3.9/site-packages/pandas/io/parsers/python_parser.py:222: FutureWarning: Possible nested set at position 1
  pat = re.compile(sep)
```
Fix this
```python
log_file = pd.read_csv(input_filename, encoding="utf-8", header=None, sep="[[\]]", names=header, engine="python")
```
To this
```python
log_file = pd.read_csv(input_filename, encoding="utf-8", header=None, sep="[\[\]]", names=header, engine="python")
```