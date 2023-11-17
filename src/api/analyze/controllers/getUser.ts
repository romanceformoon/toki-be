import { Request, Response } from 'express';
import { existsSync } from 'fs';
import { logger } from '~/config/winston';
import { generateAeryScoreData } from '~/utils/generateAeryScoreData';

export const getUser = async (req: Request, res: Response) => {
    try {
        const uid = req.params.uid;

        if (!uid) return res.status(404).send('User not found');

        const [userQuery] = await req.database.query(
            'SELECT nickname, avatar FROM user WHERE uid = ?',
            [uid]
        );

        const tempPath = `scores/${uid}`;

        if (existsSync(tempPath)) {
            const sqlite3 = require('sqlite3').verbose();
            const db = new sqlite3.Database(tempPath);

            const { userExp, clearDan } = await generateAeryScoreData(db);

            const [queryResult] = await req.database.query(
                'SELECT * FROM score WHERE uid = ?',
                [uid]
            );

            if (queryResult.length === 0) {
                try {
                    await req.database.query(
                        'INSERT INTO score (uid, aery_exp, aery_dan) VALUES(?, ?, ?)',
                        [uid, userExp, clearDan]
                    );
                } catch (err) {
                    logger.error(err);
                    return res.status(500).json({ result: 'DB Failed' });
                }
            } else {
                try {
                    await req.database.query(
                        'UPDATE score SET aery_exp = ?, aery_dan = ? WHERE uid = ?',
                        [userExp, clearDan, uid]
                    );
                } catch (err) {
                    logger.error(err);
                    return res.status(500).json({ result: 'DB Failed' });
                }
            }

            db.close();
            req.database.end();

            return res.status(200).json({
                uid,
                nickname: userQuery[0].nickname,
                avatar: userQuery[0].avatar,
                exp: userExp,
                clearDan,
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
