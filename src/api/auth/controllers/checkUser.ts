import { Request, Response } from 'express';
import { logger } from '~/config/winston';

export const checkUser = async (req: Request, res: Response) => {
  try {
    const [userQuery] = await req.database.query(
      'SELECT nickname, avatar FROM user WHERE uid = ?',
      [req.decoded['uid']]
    );

    req.database.end();
    return res.status(200).json({
      user: {
        uid: req.decoded['uid'],
        nickname: userQuery[0].nickname,
        avatar: userQuery[0].avatar,
      },
    });
  } catch (err) {
    req.database.end();
    logger.error(err);
    return res.status(500).json({ result: 'Failed' });
  }
};
