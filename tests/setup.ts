// tests/setup.ts
import { applyMigrations, resetDb, closePool, testPool } from './helpers/dbSetup';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

// 這是一個 Global Setup Function
export default async function setup() {
  console.log('🚀 Global Setup: Starting...');
  console.log('🔌 DB URL:', process.env.DATABASE_URL);
 
const client = await testPool.connect();
  try {
    // Delete public schema and rebuild
    // Remove Tables, Enums, Functions, Triggers, including migration functions
    console.log('🧹 Cleaning database schema...');
    await client.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
  } catch (err) {
    console.error('❌ Failed to clean schema:', err);
    throw err;
  } finally {
    client.release();
  }
  
  // Initialize DB: Apply Migrations (only once)
  console.log('🛠️ Applying migrations...');
  await applyMigrations();
  
  // Clean and reset db
  await resetDb();

  console.log('✅ Global Setup: Database ready.');
  
  // Teardown
  return async () => {
    console.log('🛑 Global Teardown: Closing connection...');
    await closePool();
  };
}