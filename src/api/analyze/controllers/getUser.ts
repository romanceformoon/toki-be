import { Request, Response } from 'express';
import { existsSync } from 'fs';
import { logger } from '~/config/winston';
import { getLR2ID } from '~/utils/getLR2ID';

export const getUser = async (req: Request, res: Response) => {
    try {
        const uid = req.params.uid;

        if (!uid) return res.status(404).send('User not found');

        const [userQuery] = await req.database.query(
            'SELECT nickname, avatar FROM user WHERE uid = ?',
            [uid]
        );

        const [scoreQuery] = await req.database.query(
            'SELECT aery_exp, aery_dan FROM score WHERE uid = ?',
            [uid]
        );

        req.database.end();

        const tempPath = `scores/${uid}`;

        if (existsSync(tempPath)) {
            const sqlite3 = require('sqlite3').verbose();
            const db = new sqlite3.Database(tempPath);

            const { lr2Id } = await getLR2ID(db);

            db.close();

            return res.status(200).json({
                uid,
                nickname: userQuery[0].nickname,
                avatar: userQuery[0].avatar,
                exp: scoreQuery[0].aery_exp,
                clearDan: scoreQuery[0].aery_dan,
                lr2Id,
            });
        } else {
            return res.status(200).json({
                uid,
                nickname: userQuery[0].nickname,
                avatar: userQuery[0].avatar,
            });
        }
    } catch (err) {
        logger.error(`Error occured: ${err}`);
        return res.status(500).send('Unknown error occurred.');
    }
};
