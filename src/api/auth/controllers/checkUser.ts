import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IAuth } from '~/@types/auth';
import { logger } from '~/config/winston';

export const checkUser = (req: Request, res: Response) => {
    try {
        if (!req.accessToken) return res.status(401).send('Not authorized');

        const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as jwt.Secret;

        jwt.verify(req.accessToken, JWT_SECRET_KEY);
        const decoded = jwt.decode(req.accessToken) as IAuth;

        return res.status(200).json({
            user: {
                uid: decoded['uid'],
                nickname: decoded['nickname'],
                avatar: decoded['avatar'],
            },
        });
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ result: 'Failed' });
    }
};
