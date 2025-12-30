// tests/helpers/dbSetup.ts

import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Loading .env from test (different DB_NAME)
//dotenv.config();

console.log('🔌 Connecting to DB:', process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':****@'));

// Test Pool
export const testPool = new Pool({
  connectionString: process.env.DATABASE_URL_TEST || 'postgresql://postgres:postgres@localhost:5433/shopping_test_db',
});
/*
export default async function setup() {
  console.log('🚀 Global Setup: Applying Migrations...');
  
  // 🔥 Force rebuild Delete Public Schema then rebuild
  const client = await testPool.connect();
  try {
    await client.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
  } finally {
    client.release();
  }

  await applyMigrations();
  await resetDb();

  console.log('✅ Global Setup: Database ready.');
  
  return async () => {
    await closePool();
  };
}
*/
// Read and execute Migration Files
export const applyMigrations = async () => {
  const client = await testPool.connect();
  try {
    const migrationsDir = path.join(__dirname, '../../src/db/migrations');
    
    // Sort migration files (001, 002...)
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    console.log(`🛠️ Applying ${files.length} migrations to test DB...`);

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      await client.query(sql);
    }
  } catch (error) {
    console.error('Migration failed during test setup:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Reset db data, but keep Table structure
export const resetDb = async () => {
  const client = await testPool.connect();
  try {
    // 1. 清空所有資料表 (Cascade 會一併清空關聯)
    await client.query('TRUNCATE shopping_items, shopping_categories RESTART IDENTITY CASCADE;');
    
    // 2. 重新插入預設 Categories (模擬 Migration 002 的行為)
    // 這樣每個測試開始時，都有乾淨的 'Fruits', 'Vegetables' 等資料可以使用
    await client.query(`
      INSERT INTO shopping_categories (name, description, icon) VALUES
      ('Fruits', 'Fresh fruits and berries', '🍎'),
      ('Vegetables', 'Fresh vegetables', '🥕'),
      ('Meat', 'Meat and poultry', '🍖'),
      ('Dairy', 'Milk, cheese, and dairy products', '🥛'),
      ('Bakery', 'Bread, pastries, and baked goods', '🍞'),
      ('Snacks', 'Chips, crackers, and snacks', '🍿'),
      ('Beverages', 'Drinks and beverages', '🥤'),
      ('Other', 'Other items', '📦')
      ON CONFLICT (name) DO NOTHING;
    `);
  } finally {
    client.release();
  }
};

export const closePool = async () => {
  await testPool.end();
};