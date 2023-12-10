import axios from 'axios';
import { Database } from 'sqlite3';
import { IHistory } from '~/@types/analyze';
import { logger } from '~/config/winston';
import { sqliteGetSync } from '../sqliteGetSync';
import { danData } from './danData';
import ratingData from './ratingData.json';

export const generateAeryHistory = async (db: Database) => {
    return new Promise<{
        history: IHistory;
        userExp: number;
        clearDan: string;
        topExp: number;
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

        const ratingDataJson: any = ratingData;

        let userExp = 0;

        const top50 = [];

        for (const data of tableData) {
            const currentSongLevel: string = data['level'];
            const numberLevel = parseInt(currentSongLevel.split(' ')[1]);

            try {
                const checkData = ratingDataJson[data['md5']]['fc_ratio'];
            } catch (err) {
                continue;
            }

            if (currentSongLevel === 'LEVEL DUMMY') continue;

            const fcRatio = parseFloat(
                ratingDataJson[data['md5']]['fc_ratio'].replace('%', '')
            );

            const hardRatio = parseFloat(
                ratingDataJson[data['md5']]['hard_ratio'].replace('%', '')
            );

            const fcBonus = 300 + parseFloat((1.3 ** numberLevel).toFixed(2));
            const hardBonus = 100 + parseFloat((1.2 ** numberLevel).toFixed(2));
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
                        level: data['level'],
                    });
                } else if (row['clear'] === 5) {
                    const baseScore = parseFloat(
                        (FCLevel ** numberLevel).toFixed(2)
                    );

                    // Full Combo는 BP에 따른 경험치 감소 제외
                    const addScore =
                        baseScore + 100 + fcBonus + Math.abs(row['rate']) + 0.1;

                    const ratingWeight =
                        ((100 - fcRatio) / 4) ** (numberLevel / 10);

                    const finalExp = addScore + ratingWeight;

                    history[currentSongLevel].push({
                        title: data['title'],
                        clear: 'FULL COMBO',
                        exp: finalExp,
                        bp: row['minbp'],
                        rate: row['rate'],
                        md5: data['md5'],
                        level: data['level'],
                    });

                    userExp += finalExp;
                    top50.push(finalExp);
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

                    const ratingWeight =
                        ((100 - hardRatio) / 4) ** (numberLevel / 10);

                    const finalExp = addScore + ratingWeight;

                    history[currentSongLevel].push({
                        title: data['title'],
                        clear: 'HARD CLEAR',
                        exp: finalExp,
                        bp: row['minbp'],
                        rate: row['rate'],
                        md5: data['md5'],
                        level: data['level'],
                    });

                    userExp += finalExp;
                    top50.push(finalExp);
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
                        level: data['level'],
                    });

                    userExp += addScore;
                    top50.push(addScore);
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
                        level: data['level'],
                    });

                    userExp += addScore;
                    top50.push(addScore);
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
                        level: data['level'],
                    });

                    userExp += addScore;
                    top50.push(addScore);
                }
            } catch (err) {
                logger.error(err);
                rej(err);
            }
        }

        let clearDan = 'None';

        for (const [dan, hash] of Object.entries(danData).reverse()) {
            try {
                const row = await sqliteGetSync(
                    db,
                    `SELECT clear FROM score WHERE hash = '${hash}'`
                );

                if (!row) continue;

                if (row['clear'] > 1) {
                    clearDan = dan;
                    break;
                }
            } catch (err) {
                logger.error(err);
                rej(err);
            }
        }

        top50.sort((a: number, b: number) => {
            return b - a;
        });

        let topExp = 0;

        for await (const exp of top50.slice(0, 50)) {
            topExp += exp;
        }

        res({ history, userExp, clearDan, topExp });
    });
};
