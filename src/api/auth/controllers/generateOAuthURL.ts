import { Request, Response } from 'express';

export const genertateOAuthURL = (req: Request, res: Response) => {
  return res.status(200).json({
    oauth_url: `https://discord.com/oauth2/authorize?response_type=code&client_id=${process.env.DISCORD_CLIENT_ID}&scope=identify&state=asumatoki&redirect_uri=${process.env.DISCORD_LOGIN_REDIRECT_URI}`,
  });
};
