import axios from 'axios';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '~/config/winston';

export const discordLogin = async (req: Request, res: Response) => {
    const code = req.params.code;

    const tokenURI = 'https://discord.com/api/oauth2/token';
    const identifyURI = 'https://discord.com/api/users/@me';

    try {
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

        const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as jwt.Secret;

        const accessToken = jwt.sign({ uid: 1 }, JWT_SECRET_KEY, {
            expiresIn: '1h',
            algorithm: 'HS256',
        });
        const refreshToken = jwt.sign({}, JWT_SECRET_KEY, {
            expiresIn: '14d',
            algorithm: 'HS256',
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            // domain: '.asumatoki.kr',
        });
        return res.status(200).json({
            accessToken: accessToken,
        });
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ result: 'Failed' });
    }
};
