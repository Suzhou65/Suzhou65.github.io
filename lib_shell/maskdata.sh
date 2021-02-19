#!/bin/sh
# automatic download file and rename

# Move to file download path
cd /media/hd/csv

# Wget
# Using Chrome User-agent
# Rename
# Notice that rename not include file path
wget -U "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36" \
	"URL" \
	-O "$(date '+%Y%m%d_%H%M').csv"

exit
