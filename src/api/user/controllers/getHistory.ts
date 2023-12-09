import { Request, Response } from 'express';
import { existsSync } from 'fs';
import { logger } from '~/config/winston';
import { generateAeryHistory } from '~/utils/aery/generateAeryHistory';
import { generateInsaneHistory } from '~/utils/insane/generateInsaneHistory';
import { generateSatelliteHistory } from '~/utils/satellite/generateSatelliteHistory';
import { generateStellaHistory } from '~/utils/stella/generateStellaHistory';

export const getHistory = async (req: Request, res: Response) => {
    try {
        const uid = req.params.uid;
        const category = req.params.category;

        if (!uid) return res.status(404).send('User not found');

        const tempPath = `scores/${uid}`;

        if (existsSync(tempPath)) {
            const sqlite3 = require('sqlite3').verbose();
            const db = new sqlite3.Database(tempPath);

            if (category === 'aery') {
                const { history } = await generateAeryHistory(db);

                db.close();
                return res.status(200).json(history);
            } else if (category === 'insane') {
                const { history } = await generateInsaneHistory(db);

                db.close();
                return res.status(200).json(history);
            } else if (category === 'sl') {
                const { history } = await generateSatelliteHistory(db);

                db.close();
                return res.status(200).json(history);
            } else if (category === 'st') {
                const { history } = await generateStellaHistory(db);

                db.close();
                return res.status(200).json(history);
            }
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
                'LEVEL 21': [],
                'LEVEL 22': [],
                'LEVEL 23': [],
                'LEVEL 24': [],
                'LEVEL 25': [],
            });
        }
    } catch (err) {
        logger.error(`Error occured: ${err}`);
        return res.status(500).send('Unknown error occurred.');
    }
};
