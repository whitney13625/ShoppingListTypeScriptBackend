
import { pool } from '../../config/database';
import { User } from '../../schemas/authSchemas';
import { UserRepository } from '../interfaces/userRepository';

export class PostgresUserRepository implements UserRepository {

    async createUser(email: string, passwordHash: string): Promise<User> {
        const result = await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *', [email, passwordHash]);
        return this.mapRowToUser(result.rows[0]);
    }

    async loginUser(email: string, passwordHash: string): Promise<User | null> {
        let result = await pool.query('SELECT * FROM users WHERE email = $1 AND password_hash = $2', [email, passwordHash]);
        if (result.rows.length === 0) {
            return null;
        }
        return this.mapRowToUser(result.rows[0]);
    }

    async getUserByEmail(email: string): Promise<{ user: User; passwordHash: string } | null> {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return null;
        }
        const row = result.rows[0];
        return { user: this.mapRowToUser(row), passwordHash: row.password_hash };
    }

    private mapRowToUser(row: any): User {
        return {
          id: row.id,
          email: row.name,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        };
      }
}