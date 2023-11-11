import express, { Router } from 'express';
import { refresh } from '~/api/auth/controllers/refresh';
import { authChecker } from '~/middlewares/authChecker';
import { checkUser } from '../controllers/checkUser';
import { logout } from '../controllers/logout';

const router: Router = express.Router();

router.get('/refresh', refresh);
router.get('/check-user', authChecker, checkUser);
router.get('/logout', authChecker, logout);

module.exports = router;
