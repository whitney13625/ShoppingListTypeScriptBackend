import jwt from 'jsonwebtoken';

const generateToken = (userId: number) => {
    return jwt.sign(
        { userId }, 
        process.env.JWT_SECRET || 'your_secret', 
        { expiresIn: '1d' } // Token expires in 1 day
    );
};