import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authChecker = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as jwt.Secret;
    const token = req.headers.authorization?.split('Bearer ')[1] as string;

    if (!token) {
        next();
        return res.status(401).send('Not authorized');
    }

    const decoded = jwt.verify(token, JWT_SECRET_KEY);

    if (!decoded) {
        next();
        return res.status(401).send('Not authorized');
    }

    req.accessToken = token;
    req.decoded = decoded;
    next();
};
