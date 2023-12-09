import axios from 'axios';
import { Database } from 'sqlite3';
import { IGraph } from '~/@types/analyze';
import { logger } from '~/config/winston';
import { sqliteGetSync } from '../sqliteGetSync';

export const generateInsaneGraph = async (db: Database) => {
    return new Promise<{
        graph: IGraph;
    }>(async (res, rej) => {
        const graph: IGraph = {
            FC_COUNT: {
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
                '13': 0,
                '14': 0,
                '15': 0,
                '16': 0,
                '17': 0,
                '18': 0,
                '19': 0,
                '20': 0,
                '21': 0,
                '22': 0,
                '23': 0,
                '24': 0,
                '25': 0,
            },
            HARD_COUNT: {
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
                '13': 0,
                '14': 0,
                '15': 0,
                '16': 0,
                '17': 0,
                '18': 0,
                '19': 0,
                '20': 0,
                '21': 0,
                '22': 0,
                '23': 0,
                '24': 0,
                '25': 0,
            },
            GROOVE_COUNT: {
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
                '13': 0,
                '14': 0,
                '15': 0,
                '16': 0,
                '17': 0,
                '18': 0,
                '19': 0,
                '20': 0,
                '21': 0,
                '22': 0,
                '23': 0,
                '24': 0,
                '25': 0,
            },
            EASY_COUNT: {
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
                '13': 0,
                '14': 0,
                '15': 0,
                '16': 0,
                '17': 0,
                '18': 0,
                '19': 0,
                '20': 0,
                '21': 0,
                '22': 0,
                '23': 0,
                '24': 0,
                '25': 0,
            },
            FAILED_COUNT: {
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
                '13': 0,
                '14': 0,
                '15': 0,
                '16': 0,
                '17': 0,
                '18': 0,
                '19': 0,
                '20': 0,
                '21': 0,
                '22': 0,
                '23': 0,
                '24': 0,
                '25': 0,
            },
            NOPLAY_COUNT: {
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
                '13': 0,
                '14': 0,
                '15': 0,
                '16': 0,
                '17': 0,
                '18': 0,
                '19': 0,
                '20': 0,
                '21': 0,
                '22': 0,
                '23': 0,
                '24': 0,
                '25': 0,
            },
        };

        const data = await axios.get(
            'https://asumatoki.kr/table/insane/data.json'
        );
        const tableData = data.data;

        for (const data of tableData) {
            const currentSongLevel: string = data['level'];

            if (currentSongLevel === '???') continue;

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
