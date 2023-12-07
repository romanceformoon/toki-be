import { Request, Response } from 'express';
import { logger } from '~/config/winston';

export const getEXPRanking = async (req: Request, res: Response) => {
    try {
        const [expQuery] = await req.database.query(
            'SELECT uid, aery_exp, aery_dan FROM score ORDER BY aery_exp DESC'
        );

        const result = [];

        if (expQuery.length > 0) {
            for await (const user of expQuery) {
                const [userQuery] = await req.database.query(
                    'SELECT avatar, nickname FROM user WHERE uid = ?',
                    [user.uid]
                );

                if (userQuery.length > 0) {
                    result.push({
                        uid: user.uid,
                        avatar: userQuery[0].avatar,
                        nickname: userQuery[0].nickname,
                        exp: user.aery_exp,
                        clearDan: user.aery_dan ?? 'None',
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
