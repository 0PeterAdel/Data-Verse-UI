#!/bin/bash

# Define backup directories and destination
BACKUP_DIRS=("uploads" "error.log" "pm2.config.json")
BACKUP_DEST="backups"

# Create backup destination if it doesn't exist
mkdir -p "$BACKUP_DEST"

# Create a timestamped backup file
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DEST/backup_$TIMESTAMP.tar.gz"

# Archive and compress the directories

tar -czf "$BACKUP_FILE" ${BACKUP_DIRS[@]}

# Print success message
echo "Backup completed: $BACKUP_FILE"

# Instructions for scheduling via cron
echo "To schedule this script, add the following line to your crontab:"
echo "0 2 * * * /path/to/backup.sh"