# -*- coding: utf-8 -*-
from pathlib import Path
import argparse
import datetime
import csv
import sys

# Filter by extension
FileExtension = ".webp"
# Output file name and extension
OutputFile = "lib_img.csv"


def AskParameter():
    Parser = argparse.ArgumentParser()
    Parser.add_argument("--path", type=Path, default=Path.cwd(), help="Target folder path.")
    Parameter = Parser.parse_args()
    TargetDirectory = Parameter.path.resolve()
    if not TargetDirectory.is_dir():
        raise NotADirectoryError(f"Invalid directory: {TargetDirectory}")
    return TargetDirectory



# return files list under tatget folder
def AskList(FolderDirectory:Path):
    return sorted(
        File.name
        for File in FolderDirectory.glob(f"*{FileExtension}")
        if File.is_file())

def ImageFolderList(FolderList: list, FolderDirectory: Path):
    ListDirectory = FolderDirectory / OutputFile
    UpdateTime = datetime.datetime.now().strftime("%Y-%m-%d")
    with open(ListDirectory, mode="w", newline="", encoding="utf-8") as DataTape:
        Recording = csv.writer(DataTape)
        Recording.writerow([f"List generate date: {UpdateTime}"])
        Recording.writerows([File] for File in FolderList)
    return ListDirectory

# Runtime
try:
    TargetDirectory = AskParameter()
    FolderList = AskList(TargetDirectory)
    Result = ImageFolderList(FolderList, TargetDirectory)
    print(f"File output: {Result}")
    sys.exit(0)
except Exception as ErrorStatus:
    print(f"Error status: {ErrorStatus}")
    sys.exit(1)

# 2026H25