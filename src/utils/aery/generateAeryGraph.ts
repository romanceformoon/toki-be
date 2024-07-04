import axios from 'axios';
import { Database } from 'sqlite3';
import { IGraph } from '~/@types/analyze';
import { logger } from '~/config/winston';
import { sqliteGetSync } from '../sqliteGetSync';

export const generateAeryGraph = async (db: Database) => {
    return new Promise<{
        graph: IGraph;
    }>(async (res, rej) => {
        const graph: IGraph = {
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
                'LEVEL 20+': 0,
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
                'LEVEL 20+': 0,
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
                'LEVEL 20+': 0,
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
                'LEVEL 20+': 0,
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
                'LEVEL 20+': 0,
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
                'LEVEL 20+': 0,
            },
        };

        const data = await axios.get(
            `https://asumatoki.kr/table/aery/data.json`
        );
        const tableData = data.data;

        for (const data of tableData) {
            const currentSongLevel: string = data['level'];

            if (currentSongLevel === 'LEVEL DUMMY') continue;
            if (currentSongLevel === 'OLD CHARTS') continue;

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
