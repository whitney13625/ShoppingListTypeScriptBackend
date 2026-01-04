// tests/integration/category.api.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';
import { applyMigrations, resetDb, closePool, testPool } from '../helpers/dbSetup';

describe('Category API Integration Tests', () => {

  beforeEach(async () => { await resetDb(); });

  describe('DELETE /api/categories/:id', () => {
    it('should trigger DB constraint when deleting a used category', async () => {
      // Find default 'Dairy' Category ID
      const catRes = await testPool.query("SELECT id FROM shopping_categories WHERE name = 'Dairy'");
      const dairyId = catRes.rows[0].id;

      // Create an item that binds to 'Dairy'
      await request(app).post('/api/shopping').send({
        name: 'Milk',
        quantity: 1,
        categoryId: dairyId 
      });

      // Try delete 'Dairy'
      // Should trigger TRIGGER check_category_in_use Migration 002 constraint
      const deleteRes = await request(app).delete(`/api/categories/${dairyId}`);

      // If error.message.includes('in use'), return 409
      expect(deleteRes.status).toBe(409);
      expect(deleteRes.body.message).toMatch(/cannot delete category that is in use/i);
    });

    it('should allow deleting an unused category', async () => {

      const createRes = await request(app).post('/api/categories').send({
        name: 'Unused Cat',
        description: 'Empty',
        icon: '🗑️'
      });
      const newId = createRes.body.data.id;
    
      // Now delete it
      const deleteRes = await request(app).delete(`/api/categories/${newId}`);

      expect(deleteRes.status).toBe(200);
      
      // Verify it's really deleted
      const checkRes = await request(app).get(`/api/categories/${newId}`);
      expect(checkRes.status).toBe(404);
    });
  });
});