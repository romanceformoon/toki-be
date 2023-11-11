import { NextFunction, Request, Response } from 'express';

export const authChecker = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.headers.authorization?.split('Bearer ')[1] as string;

    if (!token) {
        next();
        return;
    }

    req.accessToken = token;
    next();
};
