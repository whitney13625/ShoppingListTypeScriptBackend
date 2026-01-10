import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

const SALT_ROUNDS = 10; // Usually 10-12 is a good balance (2^10 computation). The more the rounds, the more secure but slower.


/**
 * Encrypts a plain text password.
 */
export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Verifies if a plain text password matches the hash in DB.
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
};

export const generateToken = (userId: string): string => {
    return jwt.sign(
        { userId }, // Payload: You can put user info here (but no passwords!)
        env.JWT_SECRET,
        { expiresIn: '24h' } // Token valid for 24 hours
    );
};