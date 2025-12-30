// src/schemas/shoppingSchemas.test.ts

import { describe, it, expect } from 'vitest';
import {
  CreateShoppingItemSchema,
  UpdateShoppingItemSchema,
  GetAllItemsQuerySchema,
  ItemIdParamsSchema,
  ShoppingItemSchema
} from './shoppingSchemas';

describe('Shopping Schemas', () => {

  describe('CreateShoppingItemSchema', () => {
    it('should validate a correct payload', () => {
      const validData = {
        name: 'Milk',
        quantity: 2,
        categoryName: 'Dairy',
        // categoryId is optional
      };
      
      const result = CreateShoppingItemSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail if name is missing', () => {
      const invalidData = { quantity: 1 };
      const result = CreateShoppingItemSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should fail if name is too long (>100 chars)', () => {
      const invalidData = { 
        name: 'a'.repeat(101), 
        quantity: 1 
      };
      const result = CreateShoppingItemSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should fail if quantity is negative', () => {
      const invalidData = { 
        name: 'Milk', 
        quantity: -1 
      };
      const result = CreateShoppingItemSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should validate categoryId is a UUID if provided', () => {
      const validData = { 
        name: 'Milk', 
        quantity: 1, 
        categoryId: '123e4567-e89b-12d3-a456-426614174000' 
      };
      const result = CreateShoppingItemSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail if categoryId is invalid string', () => {
      const invalidData = { 
        name: 'Milk', 
        quantity: 1, 
        categoryId: 'not-a-uuid' 
      };
      const result = CreateShoppingItemSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });


  describe('UpdateShoppingItemSchema', () => {
    it('allows partial updates (only name)', () => {
      const data = { name: 'New Name' };
      const result = UpdateShoppingItemSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('allows partial updates (only purchased status)', () => {
      const data = { purchased: true };
      const result = UpdateShoppingItemSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('fails if name is empty string', () => {
      const data = { name: '' }; // min(1)
      const result = UpdateShoppingItemSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('fails if quantity is negative', () => {
      const data = { quantity: -5 };
      const result = UpdateShoppingItemSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  // Test Query Parameters (GET)
  // page/limit are string and checked by regex
  describe('GetAllItemsQuerySchema', () => {
    it('validates correct query parameters', () => {
      const query = {
        page: '1',
        limit: '10',
        purchased: 'true',
        search: 'apple'
      };
      const result = GetAllItemsQuerySchema.safeParse(query);
      expect(result.success).toBe(true);
    });

    it('validates optional parameters (empty query)', () => {
      const query = {};
      const result = GetAllItemsQuerySchema.safeParse(query);
      expect(result.success).toBe(true);
    });

    it('fails if page is not a number string', () => {
      const query = { page: 'abc' }; // regex /^\d+$/ will fail
      const result = GetAllItemsQuerySchema.safeParse(query);
      expect(result.success).toBe(false);
    });

    it('fails if limit is negative number string', () => {
      const query = { limit: '-5' }; // regex /^\d+$/ does not match minus sign
      const result = GetAllItemsQuerySchema.safeParse(query);
      expect(result.success).toBe(false);
    });

    it('validates purchased enum (true/false strings)', () => {
      expect(GetAllItemsQuerySchema.safeParse({ purchased: 'true' }).success).toBe(true);
      expect(GetAllItemsQuerySchema.safeParse({ purchased: 'false' }).success).toBe(true);
      expect(GetAllItemsQuerySchema.safeParse({ purchased: 'yes' }).success).toBe(false); // Invalid enum
    });
  });


  describe('ItemIdParamsSchema', () => {
    it('validates valid UUID', () => {
      const params = { id: '123e4567-e89b-12d3-a456-426614174000' };
      const result = ItemIdParamsSchema.safeParse(params);
      expect(result.success).toBe(true);
    });

    it('fails on invalid UUID', () => {
      const params = { id: '123' };
      const result = ItemIdParamsSchema.safeParse(params);
      expect(result.success).toBe(false);
    });
  });

  // Complete DB object format (Sanity check)
  // Verify DB output matches our expected structure
  describe('ShoppingItemSchema (Full Object)', () => {
    it('validates a complete item record', () => {
      const item = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Bananas',
        quantity: 5,
        categoryId: null, // nullable
        categoryName: null,
        purchased: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const result = ShoppingItemSchema.safeParse(item);
      expect(result.success).toBe(true);
    });
  });

});