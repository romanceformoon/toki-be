import axios from 'axios';
import { Database } from 'sqlite3';
import { IHistory } from '~/@types/analyze';
import { logger } from '~/config/winston';
import { sqliteGetSync } from '../sqliteGetSync';

export const generateAeryHistory = async (db: Database) => {
    return new Promise<{
        history: IHistory;
    }>(async (res, rej) => {
        const history: IHistory = {
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
        };

        const data = await axios.get(
            'https://asumatoki.kr/table/aery/data.json'
        );
        const tableData = data.data;

        for (const data of tableData) {
            const currentSongLevel: string = data['level'];
            const numberLevel = parseInt(currentSongLevel.split(' ')[1]);

            if (currentSongLevel === 'LEVEL DUMMY') continue;

            const fcBonus = 300 + parseFloat((1.4 ** numberLevel).toFixed(2));
            const hardBonus = 100;
            const grooveBonus = 50;
            const easyBonus = 25;

            const FCLevel = 1.55;
            const hardLevel = 1.5;
            const grooveLevel = 1.3;
            const easyLevel = 1.1;

            try {
                const row = await sqliteGetSync(
                    db,
                    `SELECT clear, rate, minbp FROM score WHERE hash = '${data['md5']}'`
                );

                if (!row) {
                    history[currentSongLevel].push({
                        title: data['title'],
                        clear: 'NO PLAY',
                        exp: 0,
                        bp: 0,
                        rate: 0,
                        md5: data['md5'],
                    });
                } else if (row['clear'] === 5) {
                    const baseScore = parseFloat(
                        (FCLevel ** numberLevel).toFixed(2)
                    );

                    const addScore =
                        baseScore +
                        (1 / (Math.abs(row['minbp']) + 1)) * 100 +
                        fcBonus +
                        Math.abs(row['rate']) +
                        0.1;

                    history[currentSongLevel].push({
                        title: data['title'],
                        clear: 'FULL COMBO',
                        exp: addScore,
                        bp: row['minbp'],
                        rate: row['rate'],
                        md5: data['md5'],
                    });
                } else if (row['clear'] === 4) {
                    const baseScore = parseFloat(
                        (hardLevel ** numberLevel).toFixed(2)
                    );

                    const addScore =
                        baseScore +
                        (1 / (Math.abs(row['minbp']) + 1)) * 100 +
                        hardBonus +
                        Math.abs(row['rate']) +
                        0.1;

                    history[currentSongLevel].push({
                        title: data['title'],
                        clear: 'HARD CLEAR',
                        exp: addScore,
                        bp: row['minbp'],
                        rate: row['rate'],
                        md5: data['md5'],
                    });
                } else if (row['clear'] === 3) {
                    const baseScore = parseFloat(
                        (grooveLevel ** numberLevel).toFixed(2)
                    );

                    const addScore =
                        baseScore +
                        (1 / (Math.abs(row['minbp']) + 1)) * 100 +
                        grooveBonus +
                        Math.abs(row['rate']) +
                        0.1;

                    history[currentSongLevel].push({
                        title: data['title'],
                        clear: 'GROOVE CLEAR',
                        exp: addScore,
                        bp: row['minbp'],
                        rate: row['rate'],
                        md5: data['md5'],
                    });
                } else if (row['clear'] === 2) {
                    const baseScore = parseFloat(
                        (easyLevel ** numberLevel).toFixed(2)
                    );

                    const addScore =
                        baseScore +
                        (1 / (Math.abs(row['minbp']) + 1)) * 100 +
                        easyBonus +
                        Math.abs(row['rate']) +
                        0.1;

                    history[currentSongLevel].push({
                        title: data['title'],
                        clear: 'EASY CLEAR',
                        exp: addScore,
                        bp: row['minbp'],
                        rate: row['rate'],
                        md5: data['md5'],
                    });
                } else if (row['clear'] === 1) {
                    const addScore =
                        (1 / (Math.abs(row['minbp']) + 1)) * 100 +
                        Math.abs(row['rate']) +
                        0.1;

                    history[currentSongLevel].push({
                        title: data['title'],
                        clear: 'FAILED',
                        exp: addScore,
                        bp: row['minbp'],
                        rate: row['rate'],
                        md5: data['md5'],
                    });
                }
            } catch (err) {
                logger.error(err);
                rej(err);
            }
        }

        res({ history });
    });
};
