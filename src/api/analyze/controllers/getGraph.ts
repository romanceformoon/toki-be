import { Request, Response } from 'express';
import { existsSync } from 'fs';
import { logger } from '~/config/winston';
import { generateAeryGraph } from '~/utils/aery/generateAeryGraph';

export const getGraph = async (req: Request, res: Response) => {
    try {
        const uid = req.params.uid;

        if (!uid) return res.status(404).send('User not found');

        const tempPath = `scores/${uid}`;

        if (existsSync(tempPath)) {
            const sqlite3 = require('sqlite3').verbose();
            const db = new sqlite3.Database(tempPath);

            const { graph } = await generateAeryGraph(db);

            db.close();

            return res.status(200).json(graph);
        } else {
            return res.status(200).json({
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
            });
        }
    } catch (err) {
        logger.error(`Error occured: ${err}`);
        return res.status(500).send('Unknown error occurred.');
    }
};
