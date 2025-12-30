// tests/integration/shopping.api.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';
import { resetDb, testPool } from '../helpers/dbSetup';

describe('Shopping API Integration Tests', () => {

  beforeEach(async () => {
    await resetDb();
  });

  describe('POST /api/shopping', () => {
    it('should link to an EXISTING default category (e.g., Fruits)', async () => {
      // Since resetDb rollbacks default data from Migration 002, 'Fruits' must exist
      const newItemData = {
        name: 'Gala Apple',
        quantity: 5,
        categoryName: 'Fruits',
      };

      const response = await request(app)
        .post('/api/shopping')
        .send(newItemData);

      expect(response.status).toBe(201);
      
      const item = response.body.data;
      expect(item.name).toBe('Gala Apple');
      expect(item.category.name).toBe('Fruits'); 
      expect(item.category.icon).toBe('🍎'); // Prove to be link to the default emoji of fruite
    });

    it('should create a NEW category if name does not exist', async () => {
      const newItemData = {
        name: 'Alien Food',
        quantity: 1,
        categoryName: 'Space', 
      };

      const response = await request(app)
        .post('/api/shopping')
        .send(newItemData);

      expect(response.status).toBe(201);
      const item = response.body.data;
      expect(item.category.name).toBe('Space');
      // New Category Icon could be empty string (According to the logic from ShoppingStorage)
    });

    it('should ROLLBACK category creation if item creation fails', async () => {
        
        const newItemData = {
            name: 'Rollback Test',
            quantity: -100, // Invalid DB Constraint
            categoryName: 'Ghost Category' 
        };

        await request(app).post('/api/shopping').send(newItemData);

        
        const catRes = await testPool.query("SELECT * FROM shopping_categories WHERE name = 'Ghost Category'");
        expect(catRes.rows.length).toBe(0); 
    });
  });
});