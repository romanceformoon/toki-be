import axios from 'axios';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '~/config/winston';

export const discordLogin = async (req: Request, res: Response) => {
  try {
    const code = req.params.code;

    const tokenURI = 'https://discord.com/api/oauth2/token';
    const identifyURI = 'https://discord.com/api/users/@me';

    const discordAuthResponse = await axios.post(
      tokenURI,
      {
        grant_type: 'authorization_code',
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        redirect_uri: process.env.DISCORD_LOGIN_REDIRECT_URI,
        scope: 'identify',
        code: code,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cache-Control': 'no-cache',
        },
      }
    );

    const discordIdentifyResponse = await axios.get(identifyURI, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache',
        Authorization: `Bearer ${discordAuthResponse.data.access_token}`,
      },
    });
    console.log(discordIdentifyResponse.data);

    const [queryResult] = await req.database.query(
      'SELECT * FROM user WHERE uid = ?',
      [discordIdentifyResponse.data.id]
    );

    console.log({ queryResult });

    if (queryResult.length === 0) {
      try {
        await req.database.query(
          'INSERT INTO user (uid, nickname, avatar) VALUES(?, ?, ?)',
          [
            discordIdentifyResponse.data.id,
            discordIdentifyResponse.data.username,
            discordIdentifyResponse.data.avatar,
          ]
        );
      } catch (err) {
        return res.status(500).json({ result: 'DB Failed' });
      }
    } else {
      try {
        await req.database.query('UPDATE user SET avatar = ? WHERE uid = ?', [
          discordIdentifyResponse.data.avatar,
          discordIdentifyResponse.data.id,
        ]);
      } catch (err) {
        return res.status(500).json({ result: 'DB Failed' });
      }
    }

    const [checkQuery] = await req.database.query(
      'SELECT nickname, admin FROM user WHERE uid = ?',
      [discordIdentifyResponse.data.id]
    );

    req.database.end();

    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as jwt.Secret;

    const accessToken = jwt.sign(
      {
        uid: discordIdentifyResponse.data.id,
        nickname: checkQuery[0].nickname,
        avatar: discordIdentifyResponse.data.avatar,
        admin: checkQuery[0].admin,
      },
      JWT_SECRET_KEY,
      {
        expiresIn: '1h',
        algorithm: 'HS256',
      }
    );
    const refreshToken = jwt.sign(
      {
        uid: discordIdentifyResponse.data.id,
        nickname: checkQuery[0].nickname,
        avatar: discordIdentifyResponse.data.avatar,
        admin: checkQuery[0].admin,
      },
      JWT_SECRET_KEY,
      {
        expiresIn: '14d',
        algorithm: 'HS256',
      }
    );

    if (req.hostname.includes('asumatoki.kr')) {
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        domain: 'asumatoki.kr',
        maxAge: 3600 * 24 * 14 * 1000,
      });
    } else {
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 3600 * 24 * 14 * 1000,
      });
    }

    return res.status(200).json({
      accessToken: accessToken,
    });
  } catch (err) {
    req.database.end();
    logger.error(err);
    return res.status(500).json({ result: 'Failed' });
  }
};
