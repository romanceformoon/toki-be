import axios from 'axios';
import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import jwt from 'jsonwebtoken';
import { IAuth } from '~/@types/auth';
import { IGraphResult } from '~/@types/graph';
import { logger } from '~/config/winston';
import { sqliteGetSync } from '~/utils/sqliteGetSync';

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

                    const graph: IGraphResult = {
                        FC_COUNT: {
                            'LEVEL 1': 0,
                            'LEVEL 2': 0,
                            'LEVEL 3': 0,
                            'LEVEL 4': 0,
                            'LEVEL 5': 0,
                            'LEVEL 6': 0,
                            'LEVEL 7': 0,
                            'LEVEL 8': 0,
                            'LEVEL 9': 0,
                            'LEVEL 10': 0,
                            'LEVEL 11': 0,
                            'LEVEL 12': 0,
                            'LEVEL 13': 0,
                            'LEVEL 14': 0,
                            'LEVEL 15': 0,
                            'LEVEL 16': 0,
                            'LEVEL 17': 0,
                            'LEVEL 18': 0,
                            'LEVEL 19': 0,
                            'LEVEL 20': 0,
                        },
                        HARD_COUNT: {
                            'LEVEL 1': 0,
                            'LEVEL 2': 0,
                            'LEVEL 3': 0,
                            'LEVEL 4': 0,
                            'LEVEL 5': 0,
                            'LEVEL 6': 0,
                            'LEVEL 7': 0,
                            'LEVEL 8': 0,
                            'LEVEL 9': 0,
                            'LEVEL 10': 0,
                            'LEVEL 11': 0,
                            'LEVEL 12': 0,
                            'LEVEL 13': 0,
                            'LEVEL 14': 0,
                            'LEVEL 15': 0,
                            'LEVEL 16': 0,
                            'LEVEL 17': 0,
                            'LEVEL 18': 0,
                            'LEVEL 19': 0,
                            'LEVEL 20': 0,
                        },
                        GROOVE_COUNT: {
                            'LEVEL 1': 0,
                            'LEVEL 2': 0,
                            'LEVEL 3': 0,
                            'LEVEL 4': 0,
                            'LEVEL 5': 0,
                            'LEVEL 6': 0,
                            'LEVEL 7': 0,
                            'LEVEL 8': 0,
                            'LEVEL 9': 0,
                            'LEVEL 10': 0,
                            'LEVEL 11': 0,
                            'LEVEL 12': 0,
                            'LEVEL 13': 0,
                            'LEVEL 14': 0,
                            'LEVEL 15': 0,
                            'LEVEL 16': 0,
                            'LEVEL 17': 0,
                            'LEVEL 18': 0,
                            'LEVEL 19': 0,
                            'LEVEL 20': 0,
                        },
                        EASY_COUNT: {
                            'LEVEL 1': 0,
                            'LEVEL 2': 0,
                            'LEVEL 3': 0,
                            'LEVEL 4': 0,
                            'LEVEL 5': 0,
                            'LEVEL 6': 0,
                            'LEVEL 7': 0,
                            'LEVEL 8': 0,
                            'LEVEL 9': 0,
                            'LEVEL 10': 0,
                            'LEVEL 11': 0,
                            'LEVEL 12': 0,
                            'LEVEL 13': 0,
                            'LEVEL 14': 0,
                            'LEVEL 15': 0,
                            'LEVEL 16': 0,
                            'LEVEL 17': 0,
                            'LEVEL 18': 0,
                            'LEVEL 19': 0,
                            'LEVEL 20': 0,
                        },
                        FAILED_COUNT: {
                            'LEVEL 1': 0,
                            'LEVEL 2': 0,
                            'LEVEL 3': 0,
                            'LEVEL 4': 0,
                            'LEVEL 5': 0,
                            'LEVEL 6': 0,
                            'LEVEL 7': 0,
                            'LEVEL 8': 0,
                            'LEVEL 9': 0,
                            'LEVEL 10': 0,
                            'LEVEL 11': 0,
                            'LEVEL 12': 0,
                            'LEVEL 13': 0,
                            'LEVEL 14': 0,
                            'LEVEL 15': 0,
                            'LEVEL 16': 0,
                            'LEVEL 17': 0,
                            'LEVEL 18': 0,
                            'LEVEL 19': 0,
                            'LEVEL 20': 0,
                        },
                        NOPLAY_COUNT: {
                            'LEVEL 1': 0,
                            'LEVEL 2': 0,
                            'LEVEL 3': 0,
                            'LEVEL 4': 0,
                            'LEVEL 5': 0,
                            'LEVEL 6': 0,
                            'LEVEL 7': 0,
                            'LEVEL 8': 0,
                            'LEVEL 9': 0,
                            'LEVEL 10': 0,
                            'LEVEL 11': 0,
                            'LEVEL 12': 0,
                            'LEVEL 13': 0,
                            'LEVEL 14': 0,
                            'LEVEL 15': 0,
                            'LEVEL 16': 0,
                            'LEVEL 17': 0,
                            'LEVEL 18': 0,
                            'LEVEL 19': 0,
                            'LEVEL 20': 0,
                        },
                    };

                    const data = await axios.get(
                        'https://hibyethere.github.io/table/data.json'
                    );
                    const tableData = data.data;

                    let userExp = 0;

                    const fcBonus = 700;
                    const hardBonus = 300;
                    const grooveBonus = 50;
                    const easyBonus = 25;

                    for (const data of tableData) {
                        const currentSongLevel: string = data['level'];
                        const numberLevel = parseInt(
                            currentSongLevel.split(' ')[1]
                        );

                        const baseScore = 1.5 ** numberLevel;

                        if (currentSongLevel === 'LEVEL DUMMY') continue;

                        try {
                            const row = await sqliteGetSync(
                                db,
                                `SELECT clear, rate, minbp FROM score WHERE hash = '${data['md5']}'`
                            );

                            if (!row)
                                graph['NOPLAY_COUNT'][currentSongLevel] += 1;
                            else if (row['clear'] === 5) {
                                graph['FC_COUNT'][currentSongLevel] += 1;
                                userExp +=
                                    baseScore +
                                    1 / (row['minbp'] + 1) +
                                    fcBonus +
                                    row['rate'];
                            } else if (row['clear'] === 4) {
                                graph['HARD_COUNT'][currentSongLevel] += 1;
                                userExp +=
                                    baseScore +
                                    1 / (row['minbp'] + 1) +
                                    hardBonus +
                                    row['rate'];
                            } else if (row['clear'] === 3) {
                                graph['GROOVE_COUNT'][currentSongLevel] += 1;
                                userExp +=
                                    baseScore +
                                    1 / (row['minbp'] + 1) +
                                    grooveBonus +
                                    row['rate'];
                            } else if (row['clear'] === 2) {
                                graph['EASY_COUNT'][currentSongLevel] += 1;
                                userExp +=
                                    baseScore +
                                    1 / (row['minbp'] + 1) +
                                    easyBonus +
                                    row['rate'];
                            } else if (row['clear'] === 1) {
                                graph['FAILED_COUNT'][currentSongLevel] += 1;
                            }
                        } catch (err) {
                            return res.status(400).send('db not available');
                        }
                    }

                    db.close();

                    const [queryResult] = await req.database.query(
                        'SELECT * FROM score WHERE uid = ?',
                        [decoded['uid']]
                    );

                    console.log(queryResult);

                    if (queryResult.length === 0) {
                        try {
                            await req.database.query(
                                'INSERT INTO score (uid, aery_exp) VALUES(?, ?)',
                                [decoded['uid'], userExp]
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
                                'UPDATE score SET aery_exp = ? WHERE uid = ?',
                                [userExp, decoded['uid']]
                            );
                        } catch (err) {
			    logger.error(err);
                            return res
                                .status(500)
                                .json({ result: 'DB Failed' });
                        }
                    }

                    return res.status(200).json({ graph, exp: userExp });
                }
            });
        } else {
            logger.error(`file not available`);
            return res.status(400).send('file not available');
        }
    } catch (err) {
        logger.error(`Error occured: ${err}`);
        return res.status(500).send('Unknown error occurred.');
    }
};
