# -*- coding: utf-8 -*-
import subprocess
import csv
import datetime
import sys

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
    ListResult = DecodeResult.split("\n")
    # Remove unmatch
    MatchFile = filter(FileCheck,ListResult)
    return list(MatchFile)

# Check file name
def FileCheck(ListResult):
    # File extension "webp" setting as configuration.
    if ListResult.find(".webp") != (-1):
        return True 
    elif ListResult.find(".webp") == (-1):
        return False

# Saving list to CSV
def ImageFolderList(FolderList, FolderDirectory=None):
    # File path
    if FolderDirectory is None:
        ListDirectory = ("lib_img.csv")
        pass
    elif FolderDirectory is not None:
        ListDirectory = FolderDirectory + ("/") + ("lib_img.csv")
    # Adding update time
    with open(ListDirectory,mode="w",newline="",encoding="utf-8") as DataTape:
        Recording=csv.writer(DataTape)
        Today = datetime.datetime.now()
        Updateime = Today.strftime("%Y-%m-%d")
        Recording.writerow([f"List generate date: {Updateime}"])
        DataTape.close()
    # Generate file list
    with open(ListDirectory,mode="a",newline="",encoding="utf-8") as DataTape:
        Recording=csv.writer(DataTape)
        for Files in FolderList:
            Recording.writerow([Files])
        DataTape.close()
        return ListDirectory

# Runtime
try:
    # Modify "FolderDirectory" configuration
    FolderDirectory = None
    # Get list, Saving to CSV file
    FolderList = AskList(FolderDirectory)
    Result = ImageFolderList(FolderList, FolderDirectory)
    print (f"File output: {Result}")
    sys.exit(0)
except Exception as ErrorStatus:
    print(f"Error status: {ErrorStatus}")
    sys.exit(0)

# 2024.04.17