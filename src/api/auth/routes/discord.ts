import express, { Router } from 'express';
import { discordLogin } from '~/api/auth/controllers/discordLogin';
import { genertateOAuthURL } from '~/api/auth/controllers/generateOAuthURL';
import { databaseConnector } from '~/middlewares/databaseConnector';

const router: Router = express.Router();

router.get('/oauth-url', genertateOAuthURL);
router.get('/login/:code', databaseConnector, discordLogin);

module.exports = router;
