## Processing Pixmicat Logfile
Convert Pixmicat! log file into CSV format.
### Import Module
```python
# -*- coding: utf-8 -*-
import sys
import subprocess
import pandas
```
### FileName matchimg
```python
# Using ls command get list output 
def AskList(FolderDirectory=None):
    # Ask list
    if FolderDirectory is None:
        ListAsking = subprocess.Popen(["ls","-ls"],stdout=subprocess.PIPE)
    elif FolderDirectory is not None:
        ListAsking = subprocess.Popen(["ls","-ls",FolderDirectory],stdout=subprocess.PIPE)
    # AWK filter
    AWKFilter = ["awk","{print $10}"]
    FilterOutput = subprocess.Popen(AWKFilter,stdin=ListAsking.stdout,stdout=subprocess.PIPE)
    # Dump into cache
    BytesResult = FilterOutput.communicate()[0]
    # Decode
    DecodeResult = BytesResult.decode("utf-8")
    # Listing
    ListResult = DecodeResult.split("\n")
    # Remove unmatch
    MatchFile = filter(FileCheck,ListResult)
    # Get
    return list(MatchFile)

# Check file name
def FileCheck(ListResult):
    # String "pixmicat_log" setting as you logfile configuration.
    if ListResult.find("audit") != (-1):
        return True 
    elif ListResult.find("audit") == (-1):
        return False
```
### Log2CSV
```python
# Pixmicat Log2CSV
def Log2CSV(Files,FolderDirectory=None):
    # Trans to pandas dataframe
    try:
        # Header 'E-Series' is contain extra
        HeaderConfig = ["IP","TIME","ACTION","CONTENT","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","E11","EX12"]
        # Path
        if FolderDirectory is None:
            pass
        elif FolderDirectory is not None:
            Files = FolderDirectory + "/" + Files
        # Read file
        FileCache = pandas.read_csv(Files,encoding="utf-8",header=None,sep=("[\\[\\]]"),names=HeaderConfig,engine="python")
        # Merge
        FileCache["CONTENTS"] = FileCache[FileCache.columns[3:]].apply(lambda x: " ".join(x.dropna().astype(str)), axis=1)
        # Drop
        FileCache= FileCache.drop(columns=["CONTENT","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","E11","EX12"])
        # Reanme file
        if Files.endswith("txt"):
            OutputFilename = Files.replace("ht","").replace("_audit","").replace(".txt",".csv")
        else:
            OutputFilename = Files.replace("ht","").replace("_audit","")+ (".csv")
        # Save. Using 'utf_8_sig' if you want to using Excel import data from a text file function.
        FileCache.to_csv(OutputFilename, encoding="utf_8_sig", index=False)
        # Print Info when translation complete
        print(f"File output: {OutputFilename}")
    # Error handling
    except Exception as ErrorStatus:
        print(f"Error status: {ErrorStatus}")
```
### Using
```python
# Runtime
try:
    FolderDirectory="/path/pixmicat_log"
    ReadyInput = AskList(FolderDirectory)
    # Running convert
    for Files in ReadyInput:
        Log2CSV(Files,FolderDirectory)
    # End loop
    sys.exit(0)
# Error handling
except Exception as ErrorStatus:
    print(ErrorStatus)
    sys.exit(0)
```
