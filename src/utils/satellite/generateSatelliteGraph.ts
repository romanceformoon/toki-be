import axios from 'axios';
import { Database } from 'sqlite3';
import { IGraph } from '~/@types/analyze';
import { logger } from '~/config/winston';
import { sqliteGetSync } from '../sqliteGetSync';

export const generateSatelliteGraph = async (db: Database) => {
    return new Promise<{
        graph: IGraph;
    }>(async (res, rej) => {
        const graph: IGraph = {
            FC_COUNT: {
                '0': 0,
                '1': 0,
                '2': 0,
                '3': 0,
                '4': 0,
                '5': 0,
                '6': 0,
                '7': 0,
                '8': 0,
                '9': 0,
                '10': 0,
                '11': 0,
                '12': 0,
            },
            HARD_COUNT: {
                '0': 0,
                '1': 0,
                '2': 0,
                '3': 0,
                '4': 0,
                '5': 0,
                '6': 0,
                '7': 0,
                '8': 0,
                '9': 0,
                '10': 0,
                '11': 0,
                '12': 0,
            },
            GROOVE_COUNT: {
                '0': 0,
                '1': 0,
                '2': 0,
                '3': 0,
                '4': 0,
                '5': 0,
                '6': 0,
                '7': 0,
                '8': 0,
                '9': 0,
                '10': 0,
                '11': 0,
                '12': 0,
            },
            EASY_COUNT: {
                '0': 0,
                '1': 0,
                '2': 0,
                '3': 0,
                '4': 0,
                '5': 0,
                '6': 0,
                '7': 0,
                '8': 0,
                '9': 0,
                '10': 0,
                '11': 0,
                '12': 0,
            },
            FAILED_COUNT: {
                '0': 0,
                '1': 0,
                '2': 0,
                '3': 0,
                '4': 0,
                '5': 0,
                '6': 0,
                '7': 0,
                '8': 0,
                '9': 0,
                '10': 0,
                '11': 0,
                '12': 0,
            },
            NOPLAY_COUNT: {
                '0': 0,
                '1': 0,
                '2': 0,
                '3': 0,
                '4': 0,
                '5': 0,
                '6': 0,
                '7': 0,
                '8': 0,
                '9': 0,
                '10': 0,
                '11': 0,
                '12': 0,
            },
        };

        const data = await axios.get(
            `https://stellabms.xyz/sl/score.json?_=${Date.now()}`
        );
        const tableData = data.data;

        for (const data of tableData) {
            const currentSongLevel: string = data['level'];

            try {
                const row = await sqliteGetSync(
                    db,
                    `SELECT clear, rate, minbp FROM score WHERE hash = '${data['md5']}'`
                );

                if (!row) {
                    graph['NOPLAY_COUNT'][currentSongLevel] += 1;
                } else if (row['clear'] === 5) {
                    graph['FC_COUNT'][currentSongLevel] += 1;
                } else if (row['clear'] === 4) {
                    graph['HARD_COUNT'][currentSongLevel] += 1;
                } else if (row['clear'] === 3) {
                    graph['GROOVE_COUNT'][currentSongLevel] += 1;
                } else if (row['clear'] === 2) {
                    graph['EASY_COUNT'][currentSongLevel] += 1;
                } else if (row['clear'] === 1) {
                    graph['FAILED_COUNT'][currentSongLevel] += 1;
                }
            } catch (err) {
                logger.error(err);
                rej(err);
            }
        }

        res({ graph });
    });
};
