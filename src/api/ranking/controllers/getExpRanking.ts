import { Request, Response } from 'express';
import { logger } from '~/config/winston';

export const getEXPRanking = async (req: Request, res: Response) => {
    const category = req.params.category;

    try {
        let scoreQueryString = '';
        if (category === 'aery') {
            scoreQueryString =
                'SELECT uid, aery_exp, aery_dan FROM score ORDER BY aery_exp DESC';
        } else if (category === 'insane') {
            scoreQueryString =
                'SELECT uid, insane_exp, insane_dan FROM score ORDER BY insane_exp DESC';
        } else if (category === 'sl') {
            scoreQueryString =
                'SELECT uid, sl_exp, sl_dan FROM score ORDER BY sl_exp DESC';
        } else if (category === 'st') {
            scoreQueryString =
                'SELECT uid, st_exp, st_dan FROM score ORDER BY st_exp DESC';
        }

        const [expQuery] = await req.database.query(scoreQueryString);

        const result = [];

        let exp = 0;
        let clearDan = 'None';

        if (expQuery.length > 0) {
            for await (const user of expQuery) {
                const [userQuery] = await req.database.query(
                    'SELECT avatar, nickname FROM user WHERE uid = ?',
                    [user.uid]
                );

                if (category === 'aery') {
                    exp = user.aery_exp;
                    clearDan = user.aery_dan;
                } else if (category === 'insane') {
                    exp = user.insane_exp;
                    clearDan = user.insane_dan;
                } else if (category === 'sl') {
                    exp = user.sl_exp;
                    clearDan = user.sl_dan;
                } else if (category === 'st') {
                    exp = user.st_exp;
                    clearDan = user.st_dan;
                }

                if (userQuery.length > 0) {
                    result.push({
                        uid: user.uid,
                        avatar: userQuery[0].avatar,
                        nickname: userQuery[0].nickname,
                        exp,
                        clearDan,
                    });
                }
            }

            req.database.end();
            return res.status(200).json(result);
        } else {
            req.database.end();
            return res.status(500).send('No DB Data');
        }
    } catch (err) {
        req.database.end();
        logger.error(`Error occured: ${err}`);
        return res.status(500).send('Unknown error occurred.');
    }
};
