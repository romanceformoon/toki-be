import express, { Router } from 'express';
import { changeNickname } from '~/api/auth/controllers/changeNickname';
import { checkUser } from '~/api/auth/controllers/checkUser';
import { logout } from '~/api/auth/controllers/logout';
import { refresh } from '~/api/auth/controllers/refresh';
import { authChecker } from '~/middlewares/authChecker';
import { databaseConnector } from '~/middlewares/databaseConnector';

const router: Router = express.Router();

router.get('/refresh', refresh);

router.get('/check-user', authChecker, databaseConnector, checkUser);

router.get('/logout', authChecker, logout);

router.post(
    '/change-nickname/:nickname',
    authChecker,
    databaseConnector,
    changeNickname
);

module.exports = router;
