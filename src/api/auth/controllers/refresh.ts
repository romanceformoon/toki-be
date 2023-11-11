import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '~/config/winston';

export const refresh = (req: Request, res: Response) => {
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as jwt.Secret;

    try {
        jwt.verify(req.cookies.refreshToken, JWT_SECRET_KEY);
        const decoded = jwt.decode(req.cookies.refreshToken);

        if (decoded) {
            const accessToken = jwt.sign(decoded, JWT_SECRET_KEY, {
                expiresIn: '1h',
                algorithm: 'HS256',
            });

            return res.status(200).json({
                accessToken: accessToken,
            });
        }
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ result: 'Failed' });
    }
};
