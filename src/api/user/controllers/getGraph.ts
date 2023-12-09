import { Request, Response } from 'express';
import { existsSync } from 'fs';
import { logger } from '~/config/winston';
import { generateAeryGraph } from '~/utils/aery/generateAeryGraph';
import { generateInsaneGraph } from '~/utils/insane/generateInsaneGraph';
import { generateSatelliteGraph } from '~/utils/satellite/generateSatelliteGraph';
import { generateStellaGraph } from '~/utils/stella/generateStellaGraph';

export const getGraph = async (req: Request, res: Response) => {
    try {
        const uid = req.params.uid;
        const category = req.params.category;

        if (!uid) return res.status(404).send('User not found');

        const tempPath = `scores/${uid}`;

        if (existsSync(tempPath)) {
            const sqlite3 = require('sqlite3').verbose();
            const db = new sqlite3.Database(tempPath);

            if (category === 'aery') {
                const { graph } = await generateAeryGraph(db);

                db.close();
                return res.status(200).json(graph);
            } else if (category === 'insane') {
                const { graph } = await generateInsaneGraph(db);

                db.close();
                return res.status(200).json(graph);
            } else if (category === 'sl') {
                const { graph } = await generateSatelliteGraph(db);

                db.close();
                return res.status(200).json(graph);
            } else if (category === 'st') {
                const { graph } = await generateStellaGraph(db);

                db.close();
                return res.status(200).json(graph);
            }
        } else {
            return res.status(200).json({
                FC_COUNT: {
                    'Not found': 0,
                },
                HARD_COUNT: {
                    'Not found': 0,
                },
                GROOVE_COUNT: {
                    'Not found': 0,
                },
                EASY_COUNT: {
                    'Not found': 0,
                },
                FAILED_COUNT: {
                    'Not found': 0,
                },
                NOPLAY_COUNT: {
                    'Not found': 0,
                },
            });
        }
    } catch (err) {
        logger.error(`Error occured: ${err}`);
        return res.status(500).send('Unknown error occurred.');
    }
};
