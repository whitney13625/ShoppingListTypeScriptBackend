import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthRequest } from '../controllers/interfaces/AuthRequest';

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
        (req as any).user = {
            id: decoded.userId
        }; // Initialise and inject userId for later use in Controllers

        next();
    } catch (err) {
        console.log("--- JWT Error Diagnostic ---");
        console.log("Full Error Object:", err);
        if (err instanceof Error) {
            console.error("JWT Verification Error:", err.message);
        }
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};