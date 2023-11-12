import express, { Router } from 'express';
import { refresh } from '~/api/auth/controllers/refresh';
import { authChecker } from '~/middlewares/authChecker';
import { databaseConnector } from '~/middlewares/databaseConnector';
import { changeNickname } from '../controllers/changeNickname';
import { checkUser } from '../controllers/checkUser';
import { logout } from '../controllers/logout';

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
