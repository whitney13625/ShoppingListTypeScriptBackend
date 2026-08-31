import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../controllers/interfaces/AuthRequest';

type AuthenticatedHandler = (userId: string, req: AuthRequest, res: Response) => Promise<void | Response>;

export const withAuth = <P = any, Res = any, ReqBody = any, ReqQuery = any>(
  handler: (userId: string, req: AuthRequest<P, Res, ReqBody, ReqQuery>, res: Response, next: NextFunction) => Promise<any>
) => {
  return async (req: AuthRequest<P, Res, ReqBody, ReqQuery>, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized: User identity not found" 
      });
    }

    try {
      return await handler(userId, req, res, next);
    } catch (error) {
      next(error);
    }
  };
};