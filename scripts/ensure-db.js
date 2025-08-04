import { existsSync } from 'fs';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check database path based on environment
const getDbPath = () => {
  if (process.env.DATABASE_PATH) {
    return process.env.DATABASE_PATH;
  }
  // Development path
  const projectRoot = join(__dirname, '..');
  return join(projectRoot, 'drizzle', 'db.sqlite');
};

const dbPath = getDbPath();
const isProduction = process.env.NODE_ENV === 'production';

async function ensureDatabase() {
  if (!existsSync(dbPath)) {
    console.log(`Database not found at ${dbPath}. Initializing...`);
    
    // Run the init script
    const initScript = join(__dirname, 'init-prod-db.js');
    
    return new Promise((resolve, reject) => {
      const child = spawn('node', [initScript], {
        stdio: 'inherit'
      });
      
      child.on('close', (code) => {
        if (code === 0) {
          console.log('Database initialized successfully!');
          resolve();
        } else {
          reject(new Error(`Database initialization failed with code ${code}`));
        }
      });
    });
  } else {
    console.log(`Database exists at ${dbPath}`);
  }
}

// Run the check and then start the server
ensureDatabase()
  .then(() => {
    console.log('Starting server...');
    // Start vinxi
    spawn('vinxi', ['start'], {
      stdio: 'inherit'
    });
  })
  .catch((error) => {
    console.error('Failed to ensure database:', error);
    process.exit(1);
  });