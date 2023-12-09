import { Request, Response } from 'express';
import { readdir } from 'fs/promises';
import { logger } from '~/config/winston';
import { generateAeryHistory } from '~/utils/aery/generateAeryHistory';
import { generateInsaneHistory } from '~/utils/insane/generateInsaneHistory';

export const reanalyze = async (req: Request, res: Response) => {
    try {
        const dbFiles = await readdir('scores/');

        for await (const dbFile of dbFiles) {
            const sqlite3 = require('sqlite3').verbose();
            const db = new sqlite3.Database(`scores/${dbFile}`);

            const {
                userExp: aeryExp,
                clearDan: aeryDan,
                topExp: aeryTopExp,
            } = await generateAeryHistory(db);

            const {
                userExp: insaneExp,
                clearDan: insaneDan,
                topExp: insaneTopExp,
            } = await generateInsaneHistory(db);
            
            db.close();

            const [queryResult] = await req.database.query(
                'SELECT * FROM score WHERE uid = ?',
                [dbFile]
            );

            if (queryResult.length === 0) {
                try {
                    await req.database.query(
                        'INSERT INTO score (uid, aery_exp, aery_dan, aery_rating, insane_exp, insane_dan, insane_rating) VALUES(?, ?, ?, ?, ?, ?, ?)',
                        [
                            dbFile,
                            aeryExp,
                            aeryDan,
                            aeryTopExp,
                            insaneExp,
                            insaneDan,
                            insaneTopExp,
                        ]
                    );
                } catch (err) {
                    logger.error(err);
                    return res.status(500).json({ result: 'DB Failed' });
                }
            } else {
                try {
                    await req.database.query(
                        'UPDATE score SET aery_exp = ?, aery_dan = ?, aery_rating = ?, insane_exp = ?, insane_dan = ?, insane_rating = ? WHERE uid = ?',
                        [
                            aeryExp,
                            aeryDan,
                            aeryTopExp,
                            insaneExp,
                            insaneDan,
                            insaneTopExp,
                            dbFile,
                        ]
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
        req.database.end();
        logger.error(`Error occured: ${err}`);
        return res.status(500).send('Unknown error occurred.');
    }
};
