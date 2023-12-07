import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IAuth } from '~/@types/auth';
import { logger } from '~/config/winston';

export const checkUser = async (req: Request, res: Response) => {
    try {
        if (!req.accessToken) return res.status(401).send('Not authorized');

        const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as jwt.Secret;

        jwt.verify(req.accessToken, JWT_SECRET_KEY);
        const decoded = jwt.decode(req.accessToken) as IAuth;

        const [userQuery] = await req.database.query(
            'SELECT nickname, avatar FROM user WHERE uid = ?',
            [decoded['uid']]
        );

        req.database.end();
        return res.status(200).json({
            user: {
                uid: decoded['uid'],
                nickname: userQuery[0].nickname,
                avatar: userQuery[0].avatar,
            },
        });
    } catch (err) {
        req.database.end();
        logger.error(err);
        return res.status(500).json({ result: 'Failed' });
    }
};
