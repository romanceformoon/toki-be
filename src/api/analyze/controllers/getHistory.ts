import { Request, Response } from 'express';
import { existsSync } from 'fs';
import { logger } from '~/config/winston';
import { generateAeryHistory } from '~/utils/aery/generateAeryHistory';

export const getHistory = async (req: Request, res: Response) => {
    try {
        const uid = req.params.uid;

        if (!uid) return res.status(404).send('User not found');

        const tempPath = `scores/${uid}`;

        if (existsSync(tempPath)) {
            const sqlite3 = require('sqlite3').verbose();
            const db = new sqlite3.Database(tempPath);

            const { history } = await generateAeryHistory(db);

            db.close();

            return res.status(200).json(history);
        } else {
            return res.status(200).json({
                'LEVEL 1': [],
                'LEVEL 2': [],
                'LEVEL 3': [],
                'LEVEL 4': [],
                'LEVEL 5': [],
                'LEVEL 6': [],
                'LEVEL 7': [],
                'LEVEL 8': [],
                'LEVEL 9': [],
                'LEVEL 10': [],
                'LEVEL 11': [],
                'LEVEL 12': [],
                'LEVEL 13': [],
                'LEVEL 14': [],
                'LEVEL 15': [],
                'LEVEL 16': [],
                'LEVEL 17': [],
                'LEVEL 18': [],
                'LEVEL 19': [],
                'LEVEL 20': [],
            });
        }
    } catch (err) {
        logger.error(`Error occured: ${err}`);
        return res.status(500).send('Unknown error occurred.');
    }
};
