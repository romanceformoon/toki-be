import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '~/config/winston';

export const logout = (req: Request, res: Response) => {
    try {
        if (!req.accessToken) return res.status(401).send('Not authorized');

        const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as jwt.Secret;

        jwt.verify(req.accessToken, JWT_SECRET_KEY);

        if (req.hostname.includes('asumatoki.kr')) {
            res.cookie('refreshToken', '', {
                httpOnly: true,
                domain: '.asumatoki.kr',
            });
        } else {
            res.cookie('refreshToken', '', {
                httpOnly: true,
            });
        }

        return res.status(200).json({ result: 'Success' });
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ result: 'Failed' });
    }
};
