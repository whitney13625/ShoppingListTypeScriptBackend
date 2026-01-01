// src/repositories/implementations/shopping.postgres.repository.ts

import { pool } from '../../config/database';
import { ShoppingItem } from '../../schemas/shoppingSchemas';
import { IShoppingRepository } from '../interfaces/shoppingRepository.interface';

export class ShoppingPostgresRepository implements IShoppingRepository {
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

  async create(item: ShoppingItem): Promise<ShoppingItem> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      let finalCategoryId: string | null = null;

      if (item.categoryName) {
        const findCatRes = await client.query(
          `SELECT id FROM shopping_categories WHERE name = $1`,
          [item.categoryName]
        );

        if (findCatRes.rows.length > 0) {
          finalCategoryId = findCatRes.rows[0].id;
        } else {
          const createCatRes = await client.query(
            `INSERT INTO shopping_categories (name, description, icon, created_at, updated_at)
             VALUES ($1, '', '', NOW(), NOW())
             RETURNING id`,
            [item.categoryName]
          );
          finalCategoryId = createCatRes.rows[0].id;
        }
      } else if (item.categoryId) {
        finalCategoryId = item.categoryId;
      }

      const insertItemRes = await client.query(
        `INSERT INTO shopping_items 
           (id, name, quantity, category_id, purchased, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [
          item.id,
          item.name,
          item.quantity,
          finalCategoryId,
          item.purchased,
          item.createdAt,
          item.updatedAt,
        ]
      );

      await client.query('COMMIT');

      const newItem = await this.getById(insertItemRes.rows[0].id);
      
      if (!newItem) throw new Error('Failed to retrieve created item');
      
      return newItem;

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async update(id: string, updates: Partial<ShoppingItem>): Promise<ShoppingItem | undefined> {
    const client = await pool.connect(); 

    try {
      await client.query('BEGIN');

      let finalCategoryId: string | null | undefined = updates.categoryId;

      if (updates.categoryName) {
        const findCatRes = await client.query(
          `SELECT id FROM shopping_categories WHERE name = $1`,
          [updates.categoryName]
        );

        if (findCatRes.rows.length > 0) {
          finalCategoryId = findCatRes.rows[0].id;
        } else {
          const createCatRes = await client.query(
            `INSERT INTO shopping_categories (name, description, icon, created_at, updated_at)
             VALUES ($1, '', '', NOW(), NOW())
             RETURNING id`,
            [updates.categoryName]
          );
          finalCategoryId = createCatRes.rows[0].id;
        }
      }

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
      
      if (finalCategoryId !== undefined) {
        fields.push(`category_id = $${paramCount++}`);
        values.push(finalCategoryId);
      }
      
      if (updates.purchased !== undefined) {
        fields.push(`purchased = $${paramCount++}`);
        values.push(updates.purchased);
      }
      
      fields.push(`updated_at = CURRENT_TIMESTAMP`);
      
      if (fields.length === 1) { 
        await client.query('ROLLBACK');
        return this.getById(id);
      }
      
      values.push(id);
      
      const query = `
        UPDATE shopping_items 
        SET ${fields.join(', ')}
        WHERE id = $${paramCount}
        RETURNING id
      `;
      
      const result = await client.query(query, values);
      
      if (result.rows.length === 0) {
        await client.query('ROLLBACK'); 
        return undefined;
      }

      await client.query('COMMIT'); 

      return this.getById(id);

    } catch (error) {
      await client.query('ROLLBACK'); 
      throw error;
    } finally {
      client.release();
    }
  }

  async delete(id: string): Promise<boolean> {
    const result = await pool.query(
      'DELETE FROM shopping_items WHERE id = $1',
      [id]
    );
    
    return result.rowCount !== null && result.rowCount > 0;
  }

  async clear(): Promise<void> {
    await pool.query('DELETE FROM shopping_items');
  }
  
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

  private mapRowToItemWithCategory(row: any): ShoppingItem {
    const item: any = {
      id: row.id,
      name: row.name,
      quantity: row.quantity,
      categoryId: row.category_id,
      category: row.category_name,
      purchased: row.purchased,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
    
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
