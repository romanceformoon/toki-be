import { Request, Response } from 'express';
import { readdir } from 'fs/promises';
import { logger } from '~/config/winston';
import { generateAeryScoreData } from '~/utils/aery/generateAeryScoreData';

export const reanalyze = async (req: Request, res: Response) => {
    try {
        const dbFiles = await readdir('scores/');

        for await (const dbFile of dbFiles) {
            const sqlite3 = require('sqlite3').verbose();
            const db = new sqlite3.Database(`scores/${dbFile}`);

            const { userExp, clearDan, topExp } = await generateAeryScoreData(
                db
            );

            db.close();

            const [queryResult] = await req.database.query(
                'SELECT * FROM score WHERE uid = ?',
                [dbFile]
            );

            if (queryResult.length === 0) {
                try {
                    await req.database.query(
                        'INSERT INTO score (uid, aery_exp, aery_dan, aery_rating) VALUES(?, ?, ?)',
                        [dbFile, userExp, clearDan]
                    );
                } catch (err) {
                    logger.error(err);
                    return res.status(500).json({ result: 'DB Failed' });
                }
            } else {
                try {
                    await req.database.query(
                        'UPDATE score SET aery_exp = ?, aery_dan = ?, aery_rating = ? WHERE uid = ?',
                        [userExp, clearDan, topExp, dbFile]
                    );
                } catch (err) {
                    logger.error(err);
                    return res.status(500).json({ result: 'DB Failed' });
                }
            }
        }

        req.database.end();
        return res.status(200).json({ result: 'Success' });
    } catch (err) {
        logger.error(`Error occured: ${err}`);
        return res.status(500).send('Unknown error occurred.');
    }
};
