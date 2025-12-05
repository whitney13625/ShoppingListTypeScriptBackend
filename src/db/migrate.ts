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
    
    // Create migrations table to track which migrations have run
    await migrationPool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Migrations tracking table ready');
    
    // Get list of migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort(); // Ensure they run in order
    
    console.log(`📁 Found ${migrationFiles.length} migration file(s)`);
    
    // Run each migration
    for (const file of migrationFiles) {
      // Check if migration has already been run
      const result = await migrationPool.query(
        'SELECT * FROM migrations WHERE name = $1',
        [file]
      );
      
      if (result.rows.length > 0) {
        console.log(`⏭️  Skipping ${file} (already executed)`);
        continue;
      }
      
      console.log(`🔄 Running migration: ${file}`);
      
      // Read and execute migration
      const migrationPath = path.join(migrationsDir, file);
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
      
      await migrationPool.query(migrationSQL);
      
      // Record that migration has been run
      await migrationPool.query(
        'INSERT INTO migrations (name) VALUES ($1)',
        [file]
      );
      
      console.log(`✅ Completed: ${file}`);
    }
    
    console.log('✅ All migrations completed successfully');
    
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