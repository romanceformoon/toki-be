import axios from 'axios';
import { Database } from 'sqlite3';
import { logger } from '~/config/winston';
import ratingData from '~/utils/aery/ratingData.json';
import { sqliteGetSync } from '../sqliteGetSync';
import { danData } from './danData';

export const generateAeryScoreData = async (db: Database) => {
    return new Promise<{
        userExp: number;
        clearDan: string;
        lr2Id: number;
    }>(async (res, rej) => {
        const data = await axios.get(
            'https://asumatoki.kr/table/aery/data.json'
        );
        const tableData = data.data;

        const ratingDataJson: any = ratingData;

        let userExp = 0;

        for (const data of tableData) {
            const currentSongLevel: string = data['level'];
            const numberLevel = parseInt(currentSongLevel.split(' ')[1]);

            if (currentSongLevel === 'LEVEL DUMMY') continue;

            const fcRatio = parseFloat(
                ratingDataJson[data['md5']]['fc_ratio'].replace('%', '')
            );

            const hardRatio = parseFloat(
                ratingDataJson[data['md5']]['hard_ratio'].replace('%', '')
            );

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
                    continue;
                } else if (row['clear'] === 5) {
                    const baseScore = parseFloat(
                        (FCLevel ** numberLevel).toFixed(2)
                    );

                    // Full Combo는 BP에 따른 경험치 감소 제외
                    const addScore =
                        baseScore + 100 + fcBonus + Math.abs(row['rate']) + 0.1;
                    userExp += addScore + (100 - fcRatio) ** (numberLevel / 10);
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
                    userExp +=
                        addScore + (100 - hardRatio) ** (numberLevel / 10);
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
                    userExp += addScore;
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
                    userExp += addScore;
                } else if (row['clear'] === 1) {
                    const addScore =
                        (1 / (Math.abs(row['minbp']) + 1)) * 100 +
                        Math.abs(row['rate']) +
                        0.1;
                    userExp += addScore;
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

        let lr2Id = 0;

        try {
            const row = await sqliteGetSync(db, `SELECT irid FROM player`);
            lr2Id = row['irid'];
        } catch (err) {
            logger.error(err);
        }

        res({ userExp, clearDan, lr2Id });
    });
};
