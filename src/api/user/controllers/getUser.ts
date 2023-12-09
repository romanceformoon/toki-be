import { Request, Response } from 'express';
import { existsSync } from 'fs';
import { logger } from '~/config/winston';
import { getLR2ID } from '~/utils/getLR2ID';

export const getUser = async (req: Request, res: Response) => {
    try {
        const uid = req.params.uid;
        const category = req.params.category;

        if (!uid) return res.status(404).send('User not found');

        const [userQuery] = await req.database.query(
            'SELECT nickname, avatar FROM user WHERE uid = ?',
            [uid]
        );

        let scoreQueryString = '';
        if (category === 'aery') {
            scoreQueryString =
                'SELECT aery_exp, aery_dan FROM score WHERE uid = ?';
        } else if (category === 'insane') {
            scoreQueryString =
                'SELECT insane_exp, insane_dan FROM score WHERE uid = ?';
        }

        const [scoreQuery] = await req.database.query(scoreQueryString, [uid]);

        req.database.end();

        let exp = 0;
        let clearDan = 'None';

        const tempPath = `scores/${uid}`;

        if (existsSync(tempPath)) {
            const sqlite3 = require('sqlite3').verbose();
            const db = new sqlite3.Database(tempPath);

            try {
                const { lr2Id } = await getLR2ID(db);

                db.close();

                if (category === 'aery') {
                    exp = scoreQuery[0].aery_exp;
                    clearDan = scoreQuery[0].aery_dan;
                } else if (category === 'insane') {
                    exp = scoreQuery[0].insane_exp;
                    clearDan = scoreQuery[0].insane_dan;
                }

                return res.status(200).json({
                    uid,
                    nickname: userQuery[0].nickname,
                    avatar: userQuery[0].avatar,
                    exp,
                    clearDan,
                    lr2Id,
                });
            } catch (err) {
                return res.status(200).json({
                    uid,
                    nickname: userQuery[0].nickname,
                    avatar: userQuery[0].avatar,
                    exp,
                    clearDan,
                    lr2Id: 0,
                });
            }
        } else {
            return res.status(200).json({
                uid,
                nickname: userQuery[0].nickname,
                avatar: userQuery[0].avatar,
                exp,
                clearDan,
                lr2Id: 0,
            });
        }
    } catch (err) {
        req.database.end();
        logger.error(`Error occured: ${err}`);
        return res.status(500).send('Unknown error occurred.');
    }
};
