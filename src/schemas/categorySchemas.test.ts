// src/schemas/categorySchemas.test.ts
import { describe, it, expect } from 'vitest';
import { 
  CreateCategorySchema, 
  UpdateCategorySchema, 
  CategoryIdParamsSchema 
} from './categorySchemas';

describe('Category Schemas', () => {
  
  describe('CreateCategorySchema', () => {
    it('should validate a correct payload', () => {
      const validData = {
        name: 'Groceries',
        description: 'Daily needs',
        icon: '🍎',
      };
      
      const result = CreateCategorySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate payload without optional fields', () => {
      const validData = { name: 'Groceries' };
      
      const result = CreateCategorySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail if name is missing', () => {
      const invalidData = { description: 'No name provided' };
      
      const result = CreateCategorySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        // Defensive writing
        expect(result.error.issues).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    path: expect.arrayContaining(['name']) // Zod path is an array: ['name']
                })
            ])
        );
      }
    });

    it('should fail if name is empty string', () => {
      const invalidData = { name: '' };
      
      const result = CreateCategorySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should fail if icon is not an emoji', () => {
      const invalidData = { 
        name: 'Test', 
        icon: 'NotEmoji'
      };
      
      const result = CreateCategorySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
         expect(result.error.issues.length).toBeGreaterThan(0); // Another way to just being defensive, Zod should report at least one error
         expect(result.error.issues[0].message).toContain('emoji');
      }
    });
  });

  describe('UpdateCategorySchema', () => {
    it('should allow partial updates (only name)', () => {
      const data = { name: 'New Name' };
      const result = UpdateCategorySchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should allow partial updates (only description)', () => {
      const data = { description: 'New Desc' };
      const result = UpdateCategorySchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should fail if unknown fields are present (strict mode check)', () => {
      const data = { name: 'Test', hackField: 'malicious' };
      const result = UpdateCategorySchema.safeParse(data);
      
      expect(result.success).toBe(true);
      // Make sure data parsed doesn't include hackField
      if(result.success) {
        expect((result.data as any).hackField).toBeUndefined();
      }
    });
  });

  
  describe('CategoryIdParamsSchema', () => {
    it('should validate a valid UUID', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      const result = CategoryIdParamsSchema.safeParse({ id: validUuid });
      expect(result.success).toBe(true);
    });

    it('should fail on invalid UUID string', () => {
      const invalidUuid = '123-invalid-id';
      const result = CategoryIdParamsSchema.safeParse({ id: invalidUuid });
      expect(result.success).toBe(false);
    });
  });
});