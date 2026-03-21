## Processing Pixmicat Logfile
Convert Pixmicat! log file into CSV format.
### Import Module
```python
# -*- coding: utf-8 -*-
import logging
import pathlib
import pandas
```
### Runtime
```python
# Error handling
log2CsvEv = logging.getLogger(__name__)

# Reading dictionary
class Runtime():
    # Path and Pandas table element
    def __init__(self):
        try:
            # Header 'E-Series' is contain extra
            self.Header = [
                "IP","TIME","ACTION","CONTENT",
                "E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","E11","EX12"]
            # Drop element
            self.Drop = [
                "E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","E11","EX12"]
            # Default path
            self.LocalFolder = pathlib.Path.cwd()
        except Exception as ConfigurationError:
            log2CsvEv.exception(ConfigurationError)
            raise
        # 2026C21

    # Get file list inside directory
    def GetFileList(self, FolderDirectory=None, Extensions=None):
        try:
            # Get folder directory
            if FolderDirectory is None:
                TargetDirectory = self.LocalFolder
            else:
                TargetDirectory = pathlib.Path(FolderDirectory)
            # Check
            if not TargetDirectory.exists():
                raise FileNotFoundError(f"Directory {TargetDirectory} not exists")
            if not TargetDirectory.is_dir():
                raise NotADirectoryError(f"{TargetDirectory} isn't a directory")
            # Extensions filter disable
            if Extensions is None:
                DirectoryItemList = TargetDirectory.glob("*")
                return list(DirectoryItemList)
            # Extensions filter enable
            elif isinstance(Extensions,str):
                Extensions = [Extensions]
            elif isinstance(Extensions,list):
                pass
            # Extensions type error
            elif not isinstance(Extensions,(str,list)):
                raise TypeError
            ExtensionsList = [f".{Ext.lstrip('.')}" for Ext in Extensions]
            FileList = []
            for Ext in ExtensionsList:
                FileList.extend(TargetDirectory.glob(f"*{Ext}"))
            return FileList
        except Exception as GetFileListError:
            log2CsvEv.exception(GetFileListError)
            raise
        # 2026C21

    # Translate logfile into CSV
    def L0g2CSV(self, Files):
        try:
            LogFile = pathlib.Path(Files)
            # Read file
            FileCache = pandas.read_csv(
                LogFile,encoding="utf-8",engine="python", 
                header=None,sep=("[\\[\\]]"),names=self.Header)
            # Merge
            FileCache["CONTENTS"] = FileCache[FileCache.columns[3:]].apply(lambda x: " ".join(x.dropna().astype(str)), axis=1)
            # Drop
            FileCache= FileCache.drop(columns=self.Drop)
            # Reanme file
            OutputDirectoryundFilename = Files.with_suffix('')
            OutputPath = pathlib.Path(f"{OutputDirectoryundFilename}.csv")
            # Save. Using 'utf_8_sig' if you want to using Excel import data from a text file function.
            FileCache.to_csv(OutputPath,encoding="utf_8_sig",index=False)
            return(str(OutputPath))
        except Exception as L0g2CSVError:
            log2CsvEv.exception(L0g2CSVError)
            raise
        # 2026C21
```
### Script
```python
# -*- coding: utf-8 -*-
import logging
import log2csv

# Log
FORMAT = "%(asctime)s |%(levelname)s |%(message)s"
logging.basicConfig(level=logging.WARNING,filename="log2csv.log",filemode="a",format=FORMAT)

# Runtime
Pixmicat = log2csv.Runtime()
FileList = Pixmicat.GetFileList(Extensions="audit")
# Procress
for File in FileList:
    Result = Pixmicat.L0g2CSV(File)
    print(f"Output: {Result}")
```
