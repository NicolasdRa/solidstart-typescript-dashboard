#!/bin/sh

# Check if database exists, if not initialize it
if [ ! -f "/app/data/database.db" ]; then
  echo "Database not found, initializing..."
  node scripts/init-prod-db.js
else
  echo "Database found at /app/data/database.db"
fi

# Start the application
npm start