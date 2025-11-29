// src/db/migrate.ts

import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

async function runMigrations() {
  // Create a separate pool just for migration
  const migrationPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'shopping_list',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'mypassword',
  });

  try {
    console.log('🚀 Starting database migrations...');
    
    // Test connection
    await migrationPool.query('SELECT NOW()');
    console.log('✅ Connected to database');
    
    // Read migration file
    const migrationPath = path.join(__dirname, 'migrations', '001_create_shopping_items.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute migration
    await migrationPool.query(migrationSQL);
    
    console.log('✅ Migrations completed successfully');
    
    // Close pool
    await migrationPool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await migrationPool.end();
    process.exit(1);
  }
}

runMigrations();