# -*- coding: utf-8 -*-
import os
import sys
import csv
import subprocess

# Ask list
list_input = subprocess.Popen(["ls", "-ls"], stdout=subprocess.PIPE)
# AWK filter
awk_filter = ["awk", "{print $10}"]
result_output = subprocess.Popen(awk_filter, stdin=list_input.stdout, stdout=subprocess.PIPE)
# Into bytes
result_bytes = result_output.communicate()[0]
# Decode
result_decode = result_bytes.decode("utf-8")
# List
result_split = result_decode.split("\n")
del result_split[0]
del result_split[-1]

# Tuple
results = zip(result_split)
# Save to file
with open("lib_img.csv", "w", newline="") as listing:
    listing_tape = csv.writer(listing)
    for result in results:
        listing_tape.writerow(result)

print("List generate complete.")
sys.exit(0)
