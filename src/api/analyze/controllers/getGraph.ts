import { Request, Response } from 'express';
import { existsSync } from 'fs';
import { logger } from '~/config/winston';
import { generateAeryGraph } from '~/utils/generateAeryGraph';

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

            return res.status(200).json({
                graph,
            });
        } else {
            return res.status(200).json({
                result: 'Failed',
            });
        }
    } catch (err) {
        logger.error(`Error occured: ${err}`);
        return res.status(500).send('Unknown error occurred.');
    }
};
