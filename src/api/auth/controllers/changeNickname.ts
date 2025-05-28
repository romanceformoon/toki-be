import { Request, Response } from 'express';
import { logger } from '~/config/winston';

export const changeNickname = async (req: Request, res: Response) => {
  try {
    const nickname = req.params.nickname;

    if (nickname.length > 16 || nickname.length === 0)
      return res.status(400).json({ result: 'Wrong input' });

    try {
      await req.database.query('UPDATE user SET nickname = ? WHERE uid = ?', [
        nickname,
        req.decoded['uid'],
      ]);
    } catch (err) {
      req.database.end();
      return res.status(500).json({ result: 'DB Failed' });
    }

    req.database.end();
    return res.status(200).json({
      nickname,
    });
  } catch (err) {
    req.database.end();
    logger.error(err);
    return res.status(500).json({ result: 'Failed' });
  }
};
