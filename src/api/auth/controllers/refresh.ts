import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IAuth } from '~/@types/auth';
import { logger } from '~/config/winston';

export const refresh = (req: Request, res: Response) => {
    try {
        const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as jwt.Secret;

        jwt.verify(req.cookies.refreshToken, JWT_SECRET_KEY);

        const decoded = jwt.decode(req.cookies.refreshToken) as IAuth;

        const accessToken = jwt.sign(
            {
                uid: decoded['uid'],
                nickname: decoded['nickname'],
                avatar: decoded['avatar'],
            },
            JWT_SECRET_KEY,
            {
                expiresIn: '1h',
                algorithm: 'HS256',
            }
        );

        return res.status(200).json({
            accessToken: accessToken,
        });
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ result: 'Failed' });
    }
};
