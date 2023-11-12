import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IAuth } from '~/@types/auth';
import { logger } from '~/config/winston';

export const changeNickname = async (req: Request, res: Response) => {
    try {
        if (!req.accessToken) return res.status(401).send('Not authorized');

        const nickname = req.params.nickname;

        if (nickname.length > 16 || nickname.length === 0)
            return res.status(400).json({ result: 'Wrong input' });

        const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as jwt.Secret;

        jwt.verify(req.accessToken, JWT_SECRET_KEY);
        const decoded = jwt.decode(req.accessToken) as IAuth;

        try {
            await req.database.query(
                'UPDATE user SET nickname = ? WHERE uid = ?',
                [nickname, decoded['uid']]
            );
        } catch (err) {
            return res.status(500).json({ result: 'DB Failed' });
        }

        return res.status(200).json({
            nickname,
        });
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ result: 'Failed' });
    }
};
