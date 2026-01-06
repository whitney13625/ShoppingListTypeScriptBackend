import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

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