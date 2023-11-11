import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '~/config/winston';

export const checkUser = (req: Request, res: Response) => {
    const accessToken = req.headers.authorization?.split(
        'Bearer '
    )[1] as string;
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as jwt.Secret;

    try {
        jwt.verify(accessToken, JWT_SECRET_KEY);
        const decoded = jwt.decode(accessToken);

        return res.status(200).json({
            user: decoded,
        });
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ result: 'Failed' });
    }
};
