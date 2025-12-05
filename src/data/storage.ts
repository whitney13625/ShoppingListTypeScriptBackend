// src/data/storage.ts - PostgreSQL implementation

import { pool } from '../config/database';
import { ShoppingItem } from '../schemas/shoppingSchemas';

class PostgresStorage {
  // Get all items
  async getAll(): Promise<ShoppingItem[]> {
    const result = await pool.query(`
      SELECT 
        si.*,
        sc.id as category_id,
        sc.name as category_name,
        sc.description as category_description,
        sc.icon as category_icon
      FROM shopping_items si
      LEFT JOIN shopping_categories sc ON si.category_id = sc.id
      ORDER BY si.created_at DESC
    `);
    
    return result.rows.map(this.mapRowToItemWithCategory);
  }

  // Get item by ID
  async getById(id: string): Promise<ShoppingItem | undefined> {
    const result = await pool.query(`
      SELECT 
        si.*,
        sc.id as category_id,
        sc.name as category_name,
        sc.description as category_description,
        sc.icon as category_icon
      FROM shopping_items si
      LEFT JOIN shopping_categories sc ON si.category_id = sc.id
      WHERE si.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return undefined;
    }
    
    return this.mapRowToItemWithCategory(result.rows[0]);
  }

  // Create new item
  async create(item: ShoppingItem): Promise<ShoppingItem> {
    const result = await pool.query(
      `INSERT INTO shopping_items (id, name, quantity, categoryId, purchased, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        item.id,
        item.name,
        item.quantity,
        item.categoryId || null,
        item.purchased,
        item.createdAt,
        item.updatedAt,
      ]
    );
    
    // Fetch with category details (make sure data integrity, instad of returning *)
    return this.getById(result.rows[0].id) as Promise<ShoppingItem>;
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
    
    if (updates.categoryId !== undefined) {
      fields.push(`category_id = ${paramCount++}`);
      values.push(updates.categoryId);
    }
    
    if (updates.purchased !== undefined) {
      fields.push(`purchased = $${paramCount++}`);
      values.push(updates.purchased);
    }
    
    // Always update updated_at (handled by trigger, but we can also set it)
    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    
    //if (fields.length === 0) {
    if (fields.length === 1) { // Only updated_at
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
    
    // Fetch with category details
    return this.getById(id);
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
      categoryId: row.category_id,
      purchased: row.purchased,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // Helper method to map database row with category details
  private mapRowToItemWithCategory(row: any): ShoppingItem {
    const item: any = {
      id: row.id,
      name: row.name,
      quantity: row.quantity,
      categoryId: row.category_id,
      purchased: row.purchased,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
    
    // Add category details if available
    if (row.category_id) {
      item.category = {
        id: row.category_id,
        name: row.category_name,
        description: row.category_description,
        icon: row.category_icon,
      };
    }
    
    return item;
  }
}

// Export singleton instance
export const storage = new PostgresStorage();