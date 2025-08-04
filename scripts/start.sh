#!/bin/sh

echo "Starting application..."
echo "DATABASE_PATH is: $DATABASE_PATH"
echo "Checking for volume at /app/data..."
ls -la /app/data || echo "Volume not found!"

# Check if database exists, if not initialize it
if [ ! -f "/app/data/database.db" ]; then
  echo "Database not found, initializing..."
  node scripts/init-prod-db.js
  echo "Database initialization complete"
  ls -la /app/data
else
  echo "Database found at /app/data/database.db"
  ls -la /app/data/database.db
fi

# Start the application
echo "Starting Node.js application..."
npm start