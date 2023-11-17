import axios from 'axios';
import { Database } from 'sqlite3';
import { IGraph, IHistory } from '~/@types/analyze';
import { logger } from '~/config/winston';
import { danData } from './danData';
import { sqliteGetSync } from './sqliteGetSync';

export const generateAeryScoreData = async (db: Database) => {
    return new Promise<{
        userExp: number;
        graph: IGraph;
        history: IHistory;
        clearDan: string;
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
        };

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
            'https://hibyethere.github.io/table/data.json'
        );
        const tableData = data.data;

        let userExp = 0;

        for (const data of tableData) {
            const currentSongLevel: string = data['level'];
            const numberLevel = parseInt(currentSongLevel.split(' ')[1]);

            if (currentSongLevel === 'LEVEL DUMMY') continue;

            const fcBonus = 300 + parseFloat((1.4 ** numberLevel).toFixed(2));
            const hardBonus = 100;
            const grooveBonus = 50;
            const easyBonus = 25;

            const hardLevel = 1.5;
            const grooveLevel = 1.3;
            const easyLevel = 1.1;

            try {
                const row = await sqliteGetSync(
                    db,
                    `SELECT clear, rate, minbp FROM score WHERE hash = '${data['md5']}'`
                );

                if (!row) {
                    graph['NOPLAY_COUNT'][currentSongLevel] += 1;

                    history[currentSongLevel].push({
                        title: data['title'],
                        clear: 'NO PLAY',
                        exp: 0,
                        bp: 0,
                        rate: 0,
                        md5: data['md5'],
                    });
                } else if (row['clear'] === 5) {
                    graph['FC_COUNT'][currentSongLevel] += 1;

                    const baseScore = parseFloat(
                        (hardLevel ** numberLevel).toFixed(2)
                    );

                    const addScore =
                        baseScore +
                        (1 / (Math.abs(row['minbp']) + 1)) * 100 +
                        fcBonus +
                        Math.abs(row['rate']) +
                        0.1;
                    userExp += addScore;

                    history[currentSongLevel].push({
                        title: data['title'],
                        clear: 'FULL COMBO',
                        exp: addScore,
                        bp: row['minbp'],
                        rate: row['rate'],
                        md5: data['md5'],
                    });
                } else if (row['clear'] === 4) {
                    graph['HARD_COUNT'][currentSongLevel] += 1;

                    const baseScore = parseFloat(
                        (hardLevel ** numberLevel).toFixed(2)
                    );

                    const addScore =
                        baseScore +
                        (1 / (Math.abs(row['minbp']) + 1)) * 100 +
                        hardBonus +
                        Math.abs(row['rate']) +
                        0.1;
                    userExp += addScore;

                    history[currentSongLevel].push({
                        title: data['title'],
                        clear: 'HARD CLEAR',
                        exp: addScore,
                        bp: row['minbp'],
                        rate: row['rate'],
                        md5: data['md5'],
                    });
                } else if (row['clear'] === 3) {
                    graph['GROOVE_COUNT'][currentSongLevel] += 1;

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

                    history[currentSongLevel].push({
                        title: data['title'],
                        clear: 'GROOVE CLEAR',
                        exp: addScore,
                        bp: row['minbp'],
                        rate: row['rate'],
                        md5: data['md5'],
                    });
                } else if (row['clear'] === 2) {
                    graph['EASY_COUNT'][currentSongLevel] += 1;

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

                    history[currentSongLevel].push({
                        title: data['title'],
                        clear: 'EASY CLEAR',
                        exp: addScore,
                        bp: row['minbp'],
                        rate: row['rate'],
                        md5: data['md5'],
                    });
                } else if (row['clear'] === 1) {
                    graph['FAILED_COUNT'][currentSongLevel] += 1;

                    const addScore =
                        (1 / (Math.abs(row['minbp']) + 1)) * 100 +
                        Math.abs(row['rate']) +
                        0.1;
                    userExp += addScore;

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

        let clearDan = 'None';

        for (const [dan, hash] of Object.entries(danData).reverse()) {
            try {
                const row = await sqliteGetSync(
                    db,
                    `SELECT clear FROM score WHERE hash = '${hash}'`
                );

                if (!row) break;
                if (row['clear'] > 1) {
                    clearDan = dan;
                    break;
                }
            } catch (err) {
                logger.error(err);
                rej(err);
            }
        }

        res({ userExp, graph, history, clearDan });
    });
};
