import { Database } from 'sqlite3';
import { logger } from '~/config/winston';
import { sqliteGetSync } from './sqliteGetSync';

export const getLR2ID = async (db: Database) => {
    return new Promise<{
        lr2Id: number;
    }>(async (res, rej) => {
        let lr2Id = 0;

        try {
            const row = await sqliteGetSync(db, `SELECT irid FROM player`);
            lr2Id = row['irid'];
        } catch (err) {
            logger.error(err);
            rej(err);
        }

        res({ lr2Id });
    });
};
