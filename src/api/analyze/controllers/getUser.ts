import axios from 'axios';
import { Request, Response } from 'express';
import { existsSync } from 'fs';
import { IGraphResult } from '~/@types/graph';
import { logger } from '~/config/winston';
import { sqliteGetSync } from '~/utils/sqliteGetSync';

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

        const tempPath = `scores/${uid}`;

        if (existsSync(tempPath)) {
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

            for (const data of tableData) {
                const currentSongLevel: string = data['level'];

                if (currentSongLevel === 'LEVEL DUMMY') continue;

                try {
                    const row = await sqliteGetSync(
                        db,
                        `SELECT clear FROM score WHERE hash = '${data['md5']}'`
                    );

                    if (!row) graph['NOPLAY_COUNT'][currentSongLevel] += 1;
                    else if (row['clear'] === 5)
                        graph['FC_COUNT'][currentSongLevel] += 1;
                    else if (row['clear'] === 4)
                        graph['HARD_COUNT'][currentSongLevel] += 1;
                    else if (row['clear'] === 3)
                        graph['GROOVE_COUNT'][currentSongLevel] += 1;
                    else if (row['clear'] === 2)
                        graph['EASY_COUNT'][currentSongLevel] += 1;
                    else if (row['clear'] === 1)
                        graph['FAILED_COUNT'][currentSongLevel] += 1;
                } catch (err) {
                    return res.status(400).send('db not available');
                }
            }

            db.close();
            req.database.end();

            return res.status(200).json({
                uid,
                graph: graph,
                nickname: userQuery[0].nickname,
                avatar: userQuery[0].avatar,
                exp: scoreQuery[0]?.aery_exp,
                clearDan: scoreQuery[0]?.aery_dan,
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
