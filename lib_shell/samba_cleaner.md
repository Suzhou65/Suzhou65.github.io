# Debian/Raspbian Samba file cleaner

## Purpose
> macOS file system leaves various hidden files inside folders, used for purposes such as thumbnails and indexing. Of course, this isn't a problem unique to macOS — Windows exhibits similar behavior.<br>
> For cross-platform shared network drives such as Samba, a common solution is to assume by default that these files exist, using a configuration like the following:<br>
```conf
# Veto file
   veto files = /._*/.DS_Store/
   delete veto files = yes
```
> However, this setup can trigger Finder errors when transferring large numbers of files, because thumbnails and indexes can't be generated properly.<br>
> As alternative, running script on schedule to clear out these files is recommended approach.

## Script
```shell
#!/usr/bin/env bash
#
# clean-system-cache.sh — remove macOS / Windows system & cache files
#
# Targets common junk files that accumulate on shared storage:
#   macOS:   .DS_Store, ._* (AppleDouble), .Spotlight-V100, .Trashes,
#            .fseventsd, .TemporaryItems, custom Icon files, etc.
#   Windows: Thumbs.db, ehthumbs*.db, Desktop.ini, $RECYCLE.BIN,
#            System Volume Information, Office lock files (~$*), etc.
#
# Defaults to DRY-RUN — files are only listed. Pass -e to actually delete.

set -euo pipefail

DRY_RUN=true
VERBOSE=false
TARGET="both"
TARGET_PATH=""

usage() {
    cat <<'EOF'
Usage: clean-system-cache.sh [options] <path>

Options:
  -e, --execute      Actually delete (default is dry-run)
  -v, --verbose      Print each item processed
  -t, --target TYPE  mac | win | both (default: both)
  -h, --help         Show this help

Examples:
  clean-system-cache.sh /srv/samba/share              # dry-run, both OS
  clean-system-cache.sh -e /srv/samba/share           # execute, both OS
  clean-system-cache.sh -e -t mac /srv/samba/share    # macOS files only
  clean-system-cache.sh -ev /srv/samba/share          # verbose dry-run
EOF
}

# --- patterns -----------------------------------------------------------------
# Each pattern is passed to `find -name`, which matches both files and dirs.

MAC_PATTERNS=(
    ".DS_Store"
    "._*"                                   # AppleDouble (resource forks)
    ".AppleDouble"
    ".AppleDB"
    ".AppleDesktop"
    ".apdisk"                               # AirPort disk metadata
    ".LSOverride"
    ".com.apple.timemachine.donotpresent"
    ".Spotlight-V100"
    ".Trashes"
    ".fseventsd"
    ".TemporaryItems"
    "Network Trash Folder"
    "Temporary Items"
    "Icon?"                                 # Custom folder icon (Icon\r)
)

WIN_PATTERNS=(
    "Thumbs.db"
    "Thumbs.db:encryptable"
    "ehthumbs.db"
    "ehthumbs_vista.db"
    "Desktop.ini"
    "desktop.ini"
    "\$RECYCLE.BIN"
    "System Volume Information"
    "*.stackdump"
    "~\$*"                                  # MS Office lock files
)

# --- argument parsing ---------------------------------------------------------
while [[ $# -gt 0 ]]; do
    case "$1" in
        -e|--execute) DRY_RUN=false; shift ;;
        -v|--verbose) VERBOSE=true; shift ;;
        -t|--target)  TARGET="${2:-}"; shift 2 ;;
        -h|--help)    usage; exit 0 ;;
        -*)           echo "Unknown option: $1" >&2; usage; exit 1 ;;
        *)            TARGET_PATH="$1"; shift ;;
    esac
done

if [[ -z "$TARGET_PATH" ]]; then
    echo "Error: path argument required" >&2; usage; exit 1
fi
if [[ ! -d "$TARGET_PATH" ]]; then
    echo "Error: '$TARGET_PATH' is not a directory" >&2; exit 1
fi

# --- select patterns ----------------------------------------------------------
patterns=()
case "$TARGET" in
    mac)  patterns=("${MAC_PATTERNS[@]}") ;;
    win)  patterns=("${WIN_PATTERNS[@]}") ;;
    both) patterns=("${MAC_PATTERNS[@]}" "${WIN_PATTERNS[@]}") ;;
    *)    echo "Error: invalid target '$TARGET' (use mac|win|both)" >&2; exit 1 ;;
esac

# --- build find expression ----------------------------------------------------
find_expr=()
for i in "${!patterns[@]}"; do
    if (( i == 0 )); then
        find_expr+=("-name" "${patterns[$i]}")
    else
        find_expr+=("-o" "-name" "${patterns[$i]}")
    fi
done

# --- helpers ------------------------------------------------------------------
# Portable size in bytes — works on both GNU (Linux) and BSD (macOS) tools
get_size() {
    local p="$1"
    if [[ -f "$p" ]]; then
        stat -c%s "$p" 2>/dev/null || stat -f%z "$p" 2>/dev/null || echo 0
    elif [[ -d "$p" ]]; then
        du -sk "$p" 2>/dev/null | awk '{print $1 * 1024}' || echo 0
    else
        echo 0
    fi
}

human_size() {
    local b=$1
    if   (( b >= 1073741824 )); then printf '%d.%02d GB' $((b / 1073741824)) $(( (b % 1073741824) * 100 / 1073741824 ))
    elif (( b >= 1048576    )); then printf '%d.%02d MB' $((b / 1048576))    $(( (b % 1048576)    * 100 / 1048576    ))
    elif (( b >= 1024       )); then printf '%d.%02d KB' $((b / 1024))       $(( (b % 1024)       * 100 / 1024       ))
    else                            printf '%d B' "$b"
    fi
}

# --- scan ---------------------------------------------------------------------
echo "Scanning : $TARGET_PATH"
echo "Target   : $TARGET"
echo "Mode     : $($DRY_RUN && echo 'DRY-RUN (no deletion)' || echo 'EXECUTE')"
echo "---"

count=0
total=0

# -prune: don't descend into matched directories (faster, no stale-entry errors)
while IFS= read -r -d '' item; do
    size=$(get_size "$item")
    count=$((count + 1))
    total=$((total + size))

    if $VERBOSE || $DRY_RUN; then
        printf '  %s\n' "$item"
    fi

    if ! $DRY_RUN; then
        rm -rf -- "$item"
    fi
done < <(find "$TARGET_PATH" \( "${find_expr[@]}" \) -prune -print0 2>/dev/null)

echo "---"
echo "Items    : $count"
echo "Size     : $(human_size $total)"

if $DRY_RUN && (( count > 0 )); then
    echo
    echo "Dry-run complete. Re-run with -e to actually delete."
fi
```
