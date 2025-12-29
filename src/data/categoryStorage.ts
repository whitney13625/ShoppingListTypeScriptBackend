// src/data/categoryStorage.ts

import { pool } from '../config/database';
import { Category } from '../schemas/categorySchemas';

class CategoryStorage {
  // Get all categories
  async getAll(): Promise<Category[]> {
    const result = await pool.query(`
      SELECT * FROM shopping_categories
      ORDER BY name ASC
    `);
    
    return result.rows.map(this.mapRowToCategory);
  }

  // Get category by ID
  async getById(id: string): Promise<Category | undefined> {
    const result = await pool.query(
      `SELECT * FROM shopping_categories WHERE id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return undefined;
    }
    
    return this.mapRowToCategory(result.rows[0]);
  }

  // Get category by name
  async getByName(name: string): Promise<Category | undefined> {
    const result = await pool.query(
      `SELECT * FROM shopping_categories WHERE name = $1`,
      [name]
    );
    
    if (result.rows.length === 0) {
      return undefined;
    }
    
    return this.mapRowToCategory(result.rows[0]);
  }

  // Create new category
  async create(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    const result = await pool.query(
      `INSERT INTO shopping_categories (name, description, icon)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [category.name, category.description || null, category.icon || null]
    );
    
    return this.mapRowToCategory(result.rows[0]);
  }

  // Update category
  async update(
    id: string,
    updates: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Category | undefined> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;
    
    if (updates.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(updates.name);
    }
    
    if (updates.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(updates.description);
    }
    
    if (updates.icon !== undefined) {
      fields.push(`icon = $${paramCount++}`);
      values.push(updates.icon);
    }
    
    if (fields.length === 0) {
      return this.getById(id);
    }
    
    values.push(id);
    
    const query = `
      UPDATE shopping_categories 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return undefined;
    }
    
    return this.mapRowToCategory(result.rows[0]);
  }

  // Delete category
  async delete(id: string): Promise<boolean> {
    try {
      const result = await pool.query(
        `DELETE FROM shopping_categories WHERE id = $1`,
        [id]
      );
      
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error: any) {
      // If trigger prevents deletion (category in use)
      if (error.message.includes('Cannot delete category that is in use')) {
        throw new Error('Cannot delete category that is in use');
      }
      throw error;
    }
  }

  // Check if category is in use
  async isInUse(id: string): Promise<boolean> {
    const result = await pool.query(
      `SELECT EXISTS(SELECT 1 FROM shopping_items WHERE category_id = $1) as in_use`,
      [id]
    );
    
    return result.rows[0].in_use;
  }

  // Get category usage count
  async getUsageCount(id: string): Promise<number> {
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM shopping_items WHERE category_id = $1`,
      [id]
    );
    
    return parseInt(result.rows[0].count);
  }

  // Helper method to map database row to Category
  private mapRowToCategory(row: any): Category {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      icon: row.icon,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export const categoryStorage = new CategoryStorage();