import express, { Router } from 'express';
import { genertateOAuthURL } from '~/api/auth/controllers/generateOAuthURL';
import { discordLogin } from '~/api/auth/controllers/discordLogin';

const router: Router = express.Router();

router.get('/oauth-url', genertateOAuthURL);
router.get('/login/:code', discordLogin);

module.exports = router;
