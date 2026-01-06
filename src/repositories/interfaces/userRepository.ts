
import { User } from '../../schemas/authSchemas';

export interface UserRepository {
    createUser(email: string, passwordHash: string): Promise<User>; 
    loginUser(email: string, passwordHash: string): Promise<User | null>;
    getUserByEmail(email: string): Promise<{ user: User; passwordHash: string } | null>;
}