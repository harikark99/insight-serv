import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

interface CustomRequest extends Request {
    user?: { id: number };
}

const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    //console.log(authHeader);
    const token = authHeader && authHeader.split(' ')[1];
    //console.log(token);

    if (token == null) return res.sendStatus(401); // Unauthorized

    //console.log(jwtSecret as string);

    jwt.verify(token, jwtSecret as string, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden

        req.user = user as { id: number };
        next();
    });
};

export default authenticateToken;
