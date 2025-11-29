// src/data/storage.ts - PostgreSQL implementation

import { pool } from '../config/database';
import { ShoppingItem } from '../schemas/shoppingSchemas';

class PostgresStorage {
  // Get all items
  async getAll(): Promise<ShoppingItem[]> {
    const result = await pool.query(
      'SELECT * FROM shopping_items ORDER BY created_at DESC'
    );
    
    return result.rows.map(this.mapRowToItem);
  }

  // Get item by ID
  async getById(id: string): Promise<ShoppingItem | undefined> {
    const result = await pool.query(
      'SELECT * FROM shopping_items WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return undefined;
    }
    
    return this.mapRowToItem(result.rows[0]);
  }

  // Create new item
  async create(item: ShoppingItem): Promise<ShoppingItem> {
    const result = await pool.query(
      `INSERT INTO shopping_items (id, name, quantity, category, purchased, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        item.id,
        item.name,
        item.quantity,
        item.category || null,
        item.purchased,
        item.createdAt,
        item.updatedAt,
      ]
    );
    
    return this.mapRowToItem(result.rows[0]);
  }

  // Update item
  async update(id: string, updates: Partial<ShoppingItem>): Promise<ShoppingItem | undefined> {
    // Build dynamic UPDATE query
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;
    
    if (updates.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(updates.name);
    }
    
    if (updates.quantity !== undefined) {
      fields.push(`quantity = $${paramCount++}`);
      values.push(updates.quantity);
    }
    
    if (updates.category !== undefined) {
      fields.push(`category = $${paramCount++}`);
      values.push(updates.category);
    }
    
    if (updates.purchased !== undefined) {
      fields.push(`purchased = $${paramCount++}`);
      values.push(updates.purchased);
    }
    
    // Always update updated_at (handled by trigger, but we can also set it)
    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    
    if (fields.length === 0) {
      // No fields to update
      return this.getById(id);
    }
    
    // Add id as last parameter
    values.push(id);
    
    const query = `
      UPDATE shopping_items 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return undefined;
    }
    
    return this.mapRowToItem(result.rows[0]);
  }

  // Delete item
  async delete(id: string): Promise<boolean> {
    const result = await pool.query(
      'DELETE FROM shopping_items WHERE id = $1',
      [id]
    );
    
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Clear all items (for testing)
  async clear(): Promise<void> {
    await pool.query('DELETE FROM shopping_items');
  }
  
  // Helper method to map database row to ShoppingItem
  private mapRowToItem(row: any): ShoppingItem {
    return {
      id: row.id,
      name: row.name,
      quantity: row.quantity,
      category: row.category,
      purchased: row.purchased,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

// Export singleton instance
export const storage = new PostgresStorage();