import { Request, Response } from 'express';
import { hashPassword, generateToken, comparePassword } from '../utils/auth';
import { RegisterSchema, LoginSchema } from '../schemas/authSchemas'; 
import { PostgresUserRepository } from '../repositories/implementations/postgresUserRepository';

const userRepository = new PostgresUserRepository();

export const register = async (req: Request, res: Response) => {
    try {
        const validatedData = RegisterSchema.parse(req.body);

        const hashedPassword = await hashPassword(validatedData.password);

        const user = await userRepository.createUser(validatedData.email, hashedPassword);

        return res.status(201).json(user);

    } catch (error) {
        // Handle Zod or DB errors
        return res.status(400).json({ error: "Registration failed" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        
        console.log("Credential received: " + JSON.stringify(req.body));

        const { email, password } = LoginSchema.parse(req.body);

        const user = await userRepository.getUserByEmail(email);

        if (!user || !(await comparePassword(password, user.passwordHash))) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = generateToken(user.user.id);

        return res.status(200).json({
            token: token,
            user: {
                id: user.user.id,
                email: user.user.email
            }
        });

    } catch (error) {
        return res.status(400).json({ error: "Login failed" });
    }
};