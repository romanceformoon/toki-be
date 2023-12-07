import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import jwt from 'jsonwebtoken';
import { IAuth } from '~/@types/auth';
import { logger } from '~/config/winston';
import { generateAeryScoreData } from '~/utils/aery/generateAeryScoreData';

export const analyze = (req: Request, res: Response) => {
    try {
        if (!req.accessToken) return res.status(401).send('Not authorized');

        const scoreDB = req.files?.db as UploadedFile;

        if (scoreDB) {
            const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as jwt.Secret;

            jwt.verify(req.accessToken, JWT_SECRET_KEY);
            const decoded = jwt.decode(req.accessToken) as IAuth;

            const tempPath = `scores/${decoded['uid']}`;
            // Use the mv() method to place the file somewhere on your server
            scoreDB.mv(tempPath, async function (err: Error | null) {
                if (err) {
                    logger.error(`Error occured: ${err}`);
                    return res.status(500).send('Upload error occurred.');
                } else {
                    const sqlite3 = require('sqlite3').verbose();
                    const db = new sqlite3.Database(tempPath);

                    const { userExp, clearDan, topExp } =
                        await generateAeryScoreData(db);

                    db.close();

                    const [queryResult] = await req.database.query(
                        'SELECT * FROM score WHERE uid = ?',
                        [decoded['uid']]
                    );

                    if (queryResult.length === 0) {
                        try {
                            await req.database.query(
                                'INSERT INTO score (uid, aery_exp, aery_dan, aery_rating) VALUES(?, ?, ?, ?)',
                                [decoded['uid'], userExp, clearDan, topExp]
                            );
                        } catch (err) {
                            logger.error(err);
                            return res
                                .status(500)
                                .json({ result: 'DB Failed' });
                        }
                    } else {
                        try {
                            await req.database.query(
                                'UPDATE score SET aery_exp = ?, aery_dan = ?, aery_rating = ? WHERE uid = ?',
                                [userExp, clearDan, topExp, decoded['uid']]
                            );
                        } catch (err) {
                            logger.error(err);
                            return res
                                .status(500)
                                .json({ result: 'DB Failed' });
                        }
                    }

                    req.database.end();

                    return res.status(200).json({ result: 'Success' });
                }
            });
        } else {
            req.database.end();
            logger.error(`file not available`);
            return res.status(400).send('file not available');
        }
    } catch (err) {
        req.database.end();
        logger.error(`Error occured: ${err}`);
        return res.status(500).send('Unknown error occurred.');
    }
};
