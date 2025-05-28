import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { logger } from '~/config/winston';
import { generateAeryHistory } from '~/utils/aery/generateAeryHistory';
import { generateInsaneHistory } from '~/utils/insane/generateInsaneHistory';
import { generateSatelliteHistory } from '~/utils/satellite/generateSatelliteHistory';
import { generateStellaHistory } from '~/utils/stella/generateStellaHistory';

export const analyze = (req: Request, res: Response) => {
  try {
    const scoreDB = req.files?.db as UploadedFile;

    if (scoreDB) {
      const tempPath = `scores/${req.decoded['uid']}`;
      // Use the mv() method to place the file somewhere on your server
      scoreDB.mv(tempPath, async function (err: Error | null) {
        if (err) {
          logger.error(`Error occured: ${err}`);
          return res.status(500).send('Upload error occurred.');
        } else {
          const sqlite3 = require('sqlite3').verbose();
          const db = new sqlite3.Database(tempPath);

          const {
            userExp: aeryExp,
            clearDan: aeryDan,
            topExp: aeryTopExp,
          } = await generateAeryHistory(db);

          const {
            userExp: insaneExp,
            clearDan: insaneDan,
            topExp: insaneTopExp,
          } = await generateInsaneHistory(db);

          const {
            userExp: satelliteExp,
            clearDan: satelliteDan,
            topExp: satelliteTopExp,
          } = await generateSatelliteHistory(db);

          const {
            userExp: stellaExp,
            clearDan: stellaDan,
            topExp: stellaTopExp,
          } = await generateStellaHistory(db);

          db.close();

          const [queryResult] = await req.database.query(
            'SELECT * FROM score WHERE uid = ?',
            [req.decoded['uid']]
          );

          if (queryResult.length === 0) {
            try {
              await req.database.query(
                'INSERT INTO score (uid, aery_exp, aery_dan, aery_rating, insane_exp, insane_dan, insane_rating, sl_exp, sl_dan, sl_rating, st_exp, st_dan, st_rating) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                  req.decoded['uid'],
                  aeryExp,
                  aeryDan,
                  aeryTopExp,
                  insaneExp,
                  insaneDan,
                  insaneTopExp,
                  satelliteExp,
                  satelliteDan,
                  satelliteTopExp,
                  stellaExp,
                  stellaDan,
                  stellaTopExp,
                ]
              );
            } catch (err) {
              logger.error(err);
              return res.status(500).json({ result: 'DB Failed' });
            }
          } else {
            try {
              await req.database.query(
                'UPDATE score SET aery_exp = ?, aery_dan = ?, aery_rating = ?, insane_exp = ?, insane_dan = ?, insane_rating = ?, sl_exp = ?, sl_dan = ?, sl_rating = ?, st_exp = ?, st_dan = ?, st_rating = ? WHERE uid = ?',
                [
                  aeryExp,
                  aeryDan,
                  aeryTopExp,
                  insaneExp,
                  insaneDan,
                  insaneTopExp,
                  satelliteExp,
                  satelliteDan,
                  satelliteTopExp,
                  stellaExp,
                  stellaDan,
                  stellaTopExp,
                  req.decoded['uid'],
                ]
              );
            } catch (err) {
              logger.error(err);
              return res.status(500).json({ result: 'DB Failed' });
            }
          }

          req.database.end();

          return res.status(200).json({ result: 'Success' });
        }
      });
    } else {
      req.database.end();
      logger.error(`file not available`);
      return res.status(400).send('file not available');
    }
  } catch (err) {
    req.database.end();
    logger.error(`Error occured: ${err}`);
    return res.status(500).send('Unknown error occurred.');
  }
};
