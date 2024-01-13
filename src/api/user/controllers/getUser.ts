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
                'SELECT aery_exp, aery_dan, aery_rating FROM score WHERE uid = ?';
        } else if (category === 'insane') {
            scoreQueryString =
                'SELECT insane_exp, insane_dan, insane_rating FROM score WHERE uid = ?';
        } else if (category === 'sl') {
            scoreQueryString =
                'SELECT sl_exp, sl_dan, sl_rating FROM score WHERE uid = ?';
        } else if (category === 'st') {
            scoreQueryString =
                'SELECT st_exp, st_dan, st_rating FROM score WHERE uid = ?';
        }

        const [scoreQuery] = await req.database.query(scoreQueryString, [uid]);

        req.database.end();

        let exp = 0;
        let clearDan = 'None';
        let rating = 0;

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
                    rating = scoreQuery[0].aery_rating;
                } else if (category === 'insane') {
                    exp = scoreQuery[0].insane_exp;
                    clearDan = scoreQuery[0].insane_dan;
                    rating = scoreQuery[0].insane_rating;
                } else if (category === 'sl') {
                    exp = scoreQuery[0].sl_exp;
                    clearDan = scoreQuery[0].sl_dan;
                    rating = scoreQuery[0].sl_rating;
                } else if (category === 'st') {
                    exp = scoreQuery[0].st_exp;
                    clearDan = scoreQuery[0].st_dan;
                    rating = scoreQuery[0].st_rating;
                }

                return res.status(200).json({
                    uid,
                    nickname: userQuery[0].nickname,
                    avatar: userQuery[0].avatar,
                    exp,
                    clearDan,
                    lr2Id,
                    rating,
                });
            } catch (err) {
                return res.status(200).json({
                    uid,
                    nickname: userQuery[0].nickname,
                    avatar: userQuery[0].avatar,
                    exp,
                    clearDan,
                    lr2Id: 0,
                    rating,
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
                rating,
            });
        }
    } catch (err) {
        req.database.end();
        logger.error(`Error occured: ${err}`);
        return res.status(500).send('Unknown error occurred.');
    }
};
